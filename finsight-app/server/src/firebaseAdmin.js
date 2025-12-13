// server/src/firebaseAdmin.js
import "dotenv/config"; // Ensure .env is loaded before accessing process.env
import admin from "firebase-admin";

// 1️⃣ Read Base64 key from .env
const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

if (!base64Key) {
  throw new Error(
    "❌ Missing FIREBASE_SERVICE_ACCOUNT_BASE64 in .env — Firebase Admin cannot start."
  );
}

// 2️⃣ Convert Base64 → JSON
let serviceAccount;
try {
  serviceAccount = JSON.parse(
    Buffer.from(base64Key, "base64").toString("utf8")
  );
} catch (err) {
  console.error("❌ Failed to decode Firebase service account:", err);
  throw err;
}

// 3️⃣ Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin Initialized using .env Base64 key");
}

export default admin;