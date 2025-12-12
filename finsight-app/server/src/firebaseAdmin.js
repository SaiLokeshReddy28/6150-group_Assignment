// server/src/firebaseAdmin.js
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read serviceAccount JSON safely
const serviceAccount = JSON.parse(
  await fs.promises.readFile(
    path.join(__dirname, "serviceAccountKey.json"),
    "utf-8"
  )
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
