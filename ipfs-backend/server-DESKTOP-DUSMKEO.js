import express from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
import crypto from "crypto";

dotenv.config();

const app = express();
const upload = multer();


const KEY = crypto.createHash("sha256")
  .update(String(process.env.ENCRYPTION_SECRET ))
  .digest(); 




function encryptBufferCBC(buffer) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const packed = Buffer.concat([iv, ciphertext]); 
  return { iv, ciphertext, packed };
}


function encryptTextCBC(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
  let enc = cipher.update(text, "utf8", "hex");
  enc += cipher.final("hex");
  return { encryptedHex: enc, ivHex: iv.toString("hex") };
}


function sha256Hex(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}


app.get("/", (_req, res) => {
  res.send(" IPFS backend is running. Use POST /upload to send a file.");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    console.log("File received:", req.file.originalname, `${req.file.size} bytes`);


    const fileHash = sha256Hex(req.file.buffer);

    const { iv: fileIv, packed } = encryptBufferCBC(req.file.buffer);

    
    const form = new FormData();
    form.append("file", packed, `${req.file.originalname}.enc`);

    const pinRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      form,
      {
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          ...form.getHeaders(),
        },
      }
    );

    const cid = pinRes?.data?.IpfsHash;
    if (!cid) throw new Error("No CID returned by Pinata");
    console.log(" Encrypted file pinned. CID:", cid);


    const { encryptedHex, ivHex } = encryptTextCBC(cid);

    
    return res.json({
      encryptedCid: encryptedHex,
      cidIv: ivHex,
      fileHash: fileHash,
      fileIv: fileIv.toString("hex"),
    });
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
    res.status(500).json({ error: "Upload failed" });
  }
});



app.listen(4000, () => {
  console.log("Backend running at http://localhost:4000");
});
