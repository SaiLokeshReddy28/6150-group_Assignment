// src/services/aiExtractor.js
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const apiKey =
  process.env.PDF_PARSE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "";

if (!apiKey) {
  console.warn(
    "⚠️ OpenAI API key is not set. Set OPENAI_API_KEY or PDF_PARSE_OPENAI_API_KEY in your .env."
  );
}

const client = apiKey ? new OpenAI({ apiKey }) : null;

/**
 * Use OpenAI Responses API to extract structured transactions
 * from a bank / credit card statement PDF buffer.
 *
 * @param {Buffer} pdfBuffer - PDF file bytes
 * @param {Object} options
 * @param {string} [options.filename] - Original filename (for metadata only)
 * @param {string} [options.userId] - Optional user id (just for logging)
 * @returns {Promise<Array>} transactions
 */
export async function extractTransactionsWithAI(
  pdfBuffer,
  { filename = "statement.pdf", userId } = {}
) {
  if (!client) {
    throw new Error(
      "OpenAI client not configured. Set OPENAI_API_KEY or PDF_PARSE_OPENAI_API_KEY."
    );
  }

  if (!Buffer.isBuffer(pdfBuffer)) {
    throw new Error("extractTransactionsWithAI expects a PDF Buffer");
  }

  // 1. Base64 encode the PDF as required by the Responses API for file inputs
  const base64 = pdfBuffer.toString("base64");

  const systemPrompt = `
You are a precise financial statement extraction engine.

Given a bank or credit card statement PDF, you must extract each transaction as JSON.

Return ONLY a JSON array (no extra text) with objects in this exact shape:

[
  {
    "date": "YYYY-MM-DD",
    "description": "MERCHANT OR TRANSACTION DESCRIPTION",
    "amount": -123.45,
    "category": "Food & Dining"
  }
]

Rules:
- "date": ISO-8601 string YYYY-MM-DD. If date is missing or unclear, omit the transaction.
- "amount": 
    * Positive for credits/payments/refunds.
    * Negative for purchases/charges/fees.
    * Must be a number (no currency symbols).
- "description": Clean human-readable description from the line.
- "category": One of:
    "Food & Dining",
    "Transport",
    "Shopping",
    "Entertainment",
    "Housing",
    "Utilities",
    "Healthcare",
    "Education",
    "Income",
    "Fees",
    "Other"
- Ignore summary lines (e.g., TOTAL, BALANCE, PAYMENT DUE).
- Ignore headers/footers.
- DO NOT include any explanation text outside the JSON array.
`.trim();

  // 2. Call the Responses API with an input_file + input_text pair
  const response = await client.responses.create({
    model: "gpt-4.1-mini", // cheaper than full 4.1, good enough for our use
    input: [
      {
        role: "user",
        content: [
          {
            // This must be exactly type: "input_file" with string filename
            type: "input_file",
            filename, // <==== string, NOT an object
            file_data: `data:application/pdf;base64,${base64}`,
          },
          {
            type: "input_text",
            text: systemPrompt,
          },
        ],
      },
    ],
  });

  // 3. Extract the text output
  let rawText = "";

  // New Responses API often exposes output_text directly
  if (response.output_text) {
    rawText = response.output_text;
  } else if (Array.isArray(response.output)) {
    const item = response.output[0];
    if (item && Array.isArray(item.content)) {
      const textPart = item.content.find(
        (c) => c.type === "output_text" || c.type === "text"
      );
      if (textPart?.text?.value) {
        rawText = textPart.text.value;
      }
    }
  }

  if (!rawText || typeof rawText !== "string") {
    throw new Error("AI did not return any text output.");
  }

  // Optional: small debug log (trimmed to avoid flooding logs)
  console.log("🧠 AI raw output (first 300 chars):");
  console.log(rawText.slice(0, 300));

  // 4. Parse JSON safely
  let parsed;
  try {
    // Sometimes the model wraps JSON in markdown ```json ... ```
    const trimmed = rawText.trim();
    const jsonText = trimmed.startsWith("```")
      ? trimmed.replace(/```json|```/g, "").trim()
      : trimmed;

    parsed = JSON.parse(jsonText);
  } catch (err) {
    console.error("❌ Failed to parse AI JSON:", err);
    throw new Error("AI did not return valid JSON.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("AI output JSON was not an array.");
  }

  // 5. Basic normalization & filtering
  const normalized = [];
  for (const tx of parsed) {
    if (!tx || typeof tx !== "object") continue;

    const amount = Number(tx.amount);
    if (Number.isNaN(amount)) continue;

    const dateStr =
      typeof tx.date === "string" ? tx.date.trim().slice(0, 10) : null;
    let parsedDate = null;
    if (dateStr) {
      const timestamp = Date.parse(dateStr);
      if (!Number.isNaN(timestamp)) {
        parsedDate = new Date(timestamp).toISOString().slice(0, 10);
      }
    }
    if (!parsedDate) continue; // require valid date

    const description =
      tx.description && String(tx.description).trim().length > 0
        ? String(tx.description).trim()
        : "Transaction";

    const category =
      (tx.category && String(tx.category).trim()) || "Other";

    normalized.push({
      date: parsedDate, // keep as string; controller converts to Date object
      description,
      amount,
      category,
      raw: tx, // keep original AI row for debugging if needed
    });
  }

  console.log("✅ AI normalized transactions count:", normalized.length);

  return normalized;
}