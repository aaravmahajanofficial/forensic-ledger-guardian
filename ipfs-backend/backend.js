import express from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
//import ForensicChainABI from "./ForensicChainABI.json" assert { type: "json" };

import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const abiPath = path.join(__dirname, 'ForensicChainABI.json');
const ForensicChainABI = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));

dotenv.config();
const app = express();
const upload = multer();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, ForensicChainABI, wallet);


const ALLOWED_MIME = [
  "image/jpeg", "image/png", "image/gif",
  "video/mp4", "video/mkv", "video/webm",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "audio/mpeg", "audio/wav"
];

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { caseId, evidenceId, evidenceType } = req.body;

    if (!file) return res.status(400).json({ error: "No file uploaded" });
    if (!ALLOWED_MIME.includes(file.mimetype)) return res.status(400).json({ error: "File type not allowed" });

    const key = crypto.randomBytes(32); 
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([cipher.update(file.buffer), cipher.final()]);

    const data = new FormData();
    data.append("file", encrypted, file.originalname);

    const ipfsResp=await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: Infinity,
        headers: { Authorization: `Bearer ${process.env.PINATA_JWT}`, 
        ...data.getHeaders() }
      }
    );
    const cid=ipfsResp.data.IpfsHash;

    const hashOriginal=crypto.createHash("sha256").update(file.buffer).digest("hex");

    const masterKey=crypto.createHash("sha256").update(process.env.MASTER_PASSWORD).digest();
    const keyCipher=crypto.createCipheriv("aes-256-cbc", masterKey, iv);
    const keyEncrypted=Buffer.concat([keyCipher.update(key), keyCipher.final()]).toString("hex");
    const ivEncrypted = iv.toString("hex"); 

    
    const { error } = await supabase.from("evidence").insert([{
      case_id: caseId,
      evidence_id: evidenceId,
      cid: cid,
      key_encrypted: keyEncrypted,
      iv_encrypted: ivEncrypted,
      hash_original: hashOriginal
    }]);

    if (error) return res.status(500).json({ error: error.message });

    const tx = await contract.submitCaseEvidence(
      caseId,
      evidenceId,
      cid,            
      hashOriginal,    
      crypto.createHash("sha256").update(key).digest(),
      evidenceType
    );
    await tx.wait();

    res.json({ message: "Evidence uploaded and recorded on-chain", cid });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});


app.post("/confirmEvidence", async (req, res) => {
    try {
        const { caseId, index } = req.body;

        if (!caseId || index === undefined) {
            return res.status(400).json({ error: "caseId and index are required" });
        }

        const tx = await contract.confirmCaseEvidence(caseId, index);
        await tx.wait();

        res.json({ message: "Evidence confirmed on-chain", caseId, index });

    } catch (err) {
        console.error(err);
        if (err.reason) {
        return res.status(400).json({ error: err.reason }); 
        }
        res.status(500).json({ error: "Confirmation failed" });
    }
});


app.get("/retrieve/:caseId/:evidenceId", async (req, res) => {

  try {
    let { caseId, evidenceId } = req.params;
    caseId=caseId.trim();
    evidenceId=evidenceId.trim();
    console.log("CaseId param:", caseId, "EvidenceId param:", evidenceId);

    const { data, error } = await supabase.from("evidence")
      .select("*")
      .eq("case_id", caseId)
      .eq("evidence_id", evidenceId)
      .single();


    if (error || !data){
      console.error("Supabase error:", error);
      return res.status(404).json({ error: "Evidence not found" });
    } 


    const iv = Buffer.from(data.iv_encrypted, "hex");
    const masterKey = crypto.createHash("sha256").update(process.env.MASTER_PASSWORD).digest();
    const decipher = crypto.createDecipheriv("aes-256-cbc", masterKey, iv);
    const keyBuffer = Buffer.concat([decipher.update(Buffer.from(data.key_encrypted, "hex")), decipher.final()]);

    const fileResp = await axios.get(`https://${process.env.PINATA_GATEWAY}/ipfs/${data.cid}`, { responseType: "arraybuffer" });
    const encryptedFile = Buffer.from(fileResp.data);

    const fileDecipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
    const decrypted = Buffer.concat([fileDecipher.update(encryptedFile), fileDecipher.final()]);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", `attachment; filename="${evidenceId}"`);
    res.send(decrypted);

  }catch (err) {
  console.error("Retrieve failed:", err.message, err.stack, err.response?.data);
  res.status(500).json({ error: "Retrieve failed: " + err.message });
}

});

app.listen(4000, () => console.log("Backend running at http://localhost:4000"));