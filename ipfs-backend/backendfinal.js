import express from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
import cors from "cors";
import crypto from "crypto";
import mime from "mime-types";
import { promisify } from "util";
import stream from "stream";
import { createClient } from "@supabase/supabase-js";
import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import url from "url";

const pipeline = promisify(stream.pipeline);

// --- Secure password hash configuration ---
// These should be kept constant for your deployment
const PBKDF2_SALT = "ipfs-backend-v1-salt"; // Random, application-unique
const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_KEYLEN = 32; // 256 bits
const PBKDF2_DIGEST = "sha256";
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Validate critical env early to avoid runtime surprises
// if (!process.env.MASTER_PASSWORD) {
//   console.error("Critical: MASTER_PASSWORD is not set. Encryption/decryption will fail.");
//   console.error("Set MASTER_PASSWORD in your environment and restart the server.");
// }
const abiPath = path.join(__dirname, "ForensicChainABI.json");
const ForensicChainABI = JSON.parse(fs.readFileSync(abiPath, "utf-8"));

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

// Middleware
const allowedOrigins = [
  "http://localhost:4000",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:8080",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Additional safety CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Debug logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

// Initialize Supabase client
const _supabaseUrl =
  process.env.SUPABASE_URL || "https://yjoysfvxmjpbylbtmlwc.supabase.co";
const _supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlqb3lzZnZ4bWpwYnlsYnRtbHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNDMzNDMsImV4cCI6MjA3MDcxOTM0M30.9TlzNEzOIQcHk1TlWNyccQq5tEHWV5sFODDnWwnIRJk";
if (!_supabaseUrl || !_supabaseKey) {
  console.warn(
    "Supabase URL or Key missing. Supabase writes will likely fail. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY) are set.",
  );
}
const supabase = createClient(_supabaseUrl, _supabaseKey);
const PJWT =
  process.env.PINATA_JWT ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5MGEwMWU3MS01MGE0LTRmODEtODkzYy01ZDNkMmFjM2U3ZjIiLCJlbWFpbCI6Im1hbmRoYW5haGVtYW5zaHVAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjNmM2ZhNjM4ZmFjOTI0Y2FlYmFkIiwic2NvcGVkS2V5U2VjcmV0IjoiYmRjYjA5OTllNzA3OTFlZjExNTZiYmM3OTc0NWVkN2QwNWQ3MWU3MjQ1ZTExZTc1NjQ4Yzg4OGVlMTRiOWMyNiIsImV4cCI6MTc5NDUwNDg0NX0.IAyn4idO0RZFcq9rgeWctlqPOVpdIcd3dHGKSfkBZZo";
// Pinata JWT required
if (!PJWT) {
  console.warn("PINATA_JWT is not set. Pinata metadata lookups will fail.");
}

// Web3 initialization
const SRPC =
  process.env.SEPOLIA_RPC_URL ||
  "https://eth-sepolia.g.alchemy.com/v2/fg6YcFNolf21MTb_naEvF";
const SPVT =
  process.env.SEPOLIA_PRIVATE_KEY ||
  "d87f8c49f3b3733f112a4565158abf591385b464679fc6c5f58c853e695cbfb7";
const CONTADD =
  process.env.CONTRACT_ADDRESS || "0x1e0e98b2bb9b4fabe7f497f8b609a319472a5758";
const provider = new ethers.JsonRpcProvider(SRPC);
const wallet = new ethers.Wallet(SPVT, provider);
console.log(wallet.address);
const contract = new ethers.Contract(CONTADD, ForensicChainABI, wallet);

const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "video/mp4",
  "video/mkv",
  "video/webm",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "audio/mpeg",
  "audio/wav",
];

// Evidence type mapping
const EvidenceType = {
  Image: 0,
  Video: 1,
  Document: 2,
  Other: 3,
};

const MIME_GROUPS = {
  0: ["image/jpeg", "image/png", "image/jpg"], // Image
  1: ["video/mp4", "video/mkv", "video/webm"], // Video
  2: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ], // Document
  3: ALLOWED_MIME, // Other
};

// In-memory cache for Pinata metadata
const filenameCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Filename sanitizer
function sanitizeFilename(name) {
  return String(name || "")
    .replace(/[\r\n"]/g, "") // strip CR/LF and quotes
    .replace(/[/\\<>:;|?*\x00-\x1F]/g, "_") // replace path/control chars
    .trim();
}

function getMasterKeyOrThrow() {
  const pw =
    process.env.MASTER_PASSWORD ||
    "1e7548fd1b170145c49cf8dbb88d7a1a02faa914f842a1e61fc25525fd76b744";
  if (!pw)
    throw new Error("MASTER_PASSWORD not set; cannot encrypt/decrypt keys");
  // Use PBKDF2 for computational difficulty (slow hash)
  return crypto.pbkdf2Sync(
    String(pw),
    PBKDF2_SALT,
    PBKDF2_ITERATIONS,
    PBKDF2_KEYLEN,
    PBKDF2_DIGEST
  );
}

// Get filename from Pinata metadata with caching
async function getPinnedFilenameFromPinata(cid) {
  const cached = filenameCache.get(cid);
  if (cached && cached.expiry > Date.now()) return cached.name;

  if (!PJWT) return null;

  try {
    const pinataMetaUrl = `https://api.pinata.cloud/data/pinList?hashContains=${encodeURIComponent(
      cid,
    )}&status=pinned&limit=1`;
    const resp = await axios.get(pinataMetaUrl, {
      headers: { Authorization: `Bearer ${PJWT}` },
      timeout: 10_000,
    });

    const rows = resp.data?.rows;
    let candidate = null;
    if (Array.isArray(rows) && rows.length > 0) {
      candidate =
        rows[0]?.metadata?.name || rows[0]?.metadata?.keyvalues?.name || null;
    }

    if (candidate && typeof candidate === "string") {
      const clean = sanitizeFilename(candidate);
      filenameCache.set(cid, {
        name: clean,
        expiry: Date.now() + CACHE_TTL_MS,
      });
      return clean;
    }
  } catch (err) {
    console.warn("Pinata metadata lookup failed:", err.message);
  }

  return null;
}

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Forensic Ledger Guardian IPFS Backend is running!",
    endpoints: {
      fir: "POST /fir (file FIR on blockchain)",
      "fir-upload": "POST /fir/:firId/upload (upload evidence for FIR)",
      "fir-promote": "POST /fir/:firId/promote (promote FIR to case)",
      "case-upload": "POST /case/:caseId/upload (upload evidence for case)",
      "case-confirm": "POST /case/:containerId/confirm (confirm evidence)",
      retrieve: "GET /retrieve/:containerId/:evidenceId (retrieve evidence)",
      sync: "GET /sync (verify integrity)",
      upload: "POST /upload (generic upload to IPFS/Supabase)",
      "retrieve-cid": "GET /retrieve/:cid (retrieve by CID only)",
    },
  });
});

// 1. File FIR
app.post("/fir", async (req, res) => {
  try {
    const {
      firId,
      description,
      location,
      incident,
      complainant,
      suspect,
      witnesses,
    } = req.body;

    // Validate required fields
    if (!firId || !description || !location) {
      return res.status(400).json({
        error: "firId, description, and location are required",
      });
    }

    if (
      !incident ||
      !incident.title ||
      !incident.type ||
      !incident.description
    ) {
      return res.status(400).json({
        error: "Incident details (title, type, description) are required",
      });
    }

    if (!complainant || !complainant.name || !complainant.contactNumber) {
      return res.status(400).json({
        error: "Complainant name and contact number are required",
      });
    }

    // File FIR on blockchain
    const tx = await contract.fileFIR(firId, description);
    await tx.wait();

    // 1. Upsert main FIR record in Supabase
    const { error: firError } = await supabase.from("fir").upsert(
      [
        {
          fir_id: firId,
          title: incident.title,
          incident_type: incident.type,
          incident_date: incident.date,
          incident_time: incident.time,
          incident_location: incident.location,
          description: description,
          location: location,
          filed_by: wallet.address,
          status: "pending",
        },
      ],
      { onConflict: ["fir_id"] },
    );
    if (firError) {
      console.error("Supabase FIR upsert failed:", firError.message);
      return res.status(500).json({
        error: "Failed to store FIR in Supabase",
        details: firError.message,
      });
    }

    // 2. Upsert Complainant Info in Supabase
    const { error: compError } = await supabase.from("complainant").insert([
      {
        fir_id: firId,
        name: complainant.name,
        organization: complainant.organization || null,
        contact_number: complainant.contactNumber,
        email: complainant.email || null,
      },
    ]);
    if (compError) {
      console.error("Supabase complainant upsert failed:", compError.message);
      // Log but don't fail the request - FIR is already on blockchain
    }

    // 3. Upsert Suspect Info in Supabase (if provided)
    if (suspect && (suspect.name || suspect.type || suspect.additionalInfo)) {
      const { error: suspectError } = await supabase.from("suspect").insert(
        [
          {
            fir_id: firId,
            name: suspect.name || "Unknown",
            type: suspect.type || null,
            additional_info: suspect.additionalInfo || null,
          },
        ],
        { onConflict: ["fir_id"] },
      );
      if (suspectError) {
        console.error("Supabase suspect upsert failed:", suspectError.message);
      }
    }

    // 4. Insert Witnesses in Supabase (if provided)
    if (witnesses && Array.isArray(witnesses) && witnesses.length > 0) {
      // Filter out empty witnesses
      const validWitnesses = witnesses.filter(
        (w) => w.name || w.contact_info || w.statement,
      );

      if (validWitnesses.length > 0) {
        const witnessRecords = validWitnesses.map((w, index) => ({
          fir_id: firId,
          witness_index: index,
          name: w.name || null,
          contact_info: w.contact_info || null,
          statement: w.statement || null,
        }));

        const { error: witnessError } = await supabase
          .from("witness")
          .insert(witnessRecords);
        if (witnessError) {
          console.error(
            "Supabase witness upsert failed:",
            witnessError.message,
          );
          // Log but don't fail the request
        }
      }
    }

    console.log(`FIR ${firId} filed successfully with all related data`);
    res.json({
      message: "FIR filed successfully",
      firId,
      storedData: {
        fir: true,
        complainant: true,
        suspect: !!(
          suspect &&
          (suspect.name || suspect.type || suspect.additionalInfo)
        ),
        witnesses: witnesses
          ? witnesses.filter((w) => w.name || w.contact_info || w.statement)
              .length
          : 0,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
});

// 2. Submit FIR Evidence
app.post("/fir/:firId/upload", upload.single("file"), async (req, res) => {
  try {
    const { firId } = req.params;
    console.log("UPLOAD: FIR ID =", firId);
    console.log(
      "UPLOAD: Raw FIR ID chars:",
      Array.from(firId).map((c) => c.charCodeAt(0)),
    );
    const { evidenceType } = req.body;
    const evidenceId = crypto.randomUUID();
    const {
      description = null,
      deviceSource = null,
      location = null,
    } = req.body;
    const file = req.file;
    const evidenceTypeNum = EvidenceType[evidenceType];
    console.log(evidenceType);
    if (evidenceTypeNum === undefined) {
      return res.status(400).json({ error: "Invalid evidenceType" });
    }

    if (!file || !evidenceId || evidenceType === undefined)
      return res.status(400).json({ error: "Missing required data" });
    const allowed = MIME_GROUPS[evidenceTypeNum];

    if (!allowed.includes(file.mimetype)) {
      return res
        .status(400)
        .send(`Invalid file type. Only ${allowed.join(", ")} allowed.`);
    }

    // Encrypt file with random AES key
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encryptedFile = Buffer.concat([
      cipher.update(file.buffer),
      cipher.final(),
    ]);

    // Upload encrypted file to IPFS
    const formData = new FormData();
    formData.append("file", encryptedFile, { filename: `${evidenceId}.bin` });
    const pinataMetadata = {
      name: file.originalname,
    };
    formData.append("pinataMetadata", JSON.stringify(pinataMetadata));

    const ipfsResp = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: { Authorization: `Bearer ${PJWT}`, ...formData.getHeaders() },
      },
    );
    const cid = ipfsResp.data.IpfsHash;

    // Compute hash of original file
    const hashOriginal = crypto
      .createHash("sha256")
      .update(file.buffer)
      .digest("hex");

    // Encrypt AES key with master password
    const masterKey = getMasterKeyOrThrow();
    const keyCipher = crypto.createCipheriv("aes-256-cbc", masterKey, iv);
    const keyEncrypted = Buffer.concat([
      keyCipher.update(key),
      keyCipher.final(),
    ]).toString("hex");
    const ivEncrypted = iv.toString("hex");

    

    // console.log("FIR ID used in submit:", firId);
    // console.log(
    //   "Raw FIR ID string (chars):",
    //   Array.from(firId).map((c) => c.charCodeAt(0)),
    // );
    // Store CID & hash on-chain
    try {
      const tx = await contract.submitFIREvidence(
        firId,
        evidenceId,
        cid,
        hashOriginal,
        evidenceTypeNum,
      );
      await tx.wait();
      // Store key/IV off-chain
    const { error } = await supabase.from("evidence1").insert([
      {
        container_id: firId,
        evidence_id: evidenceId,
        cid: cid,
        hash_original: hashOriginal,
        original_filename: file.originalname,
        key_encrypted: keyEncrypted,
        iv_encrypted: ivEncrypted,
        type: evidenceType,
        description: description || null,
        device_source: deviceSource || null,
        collection_location: location || null,
      },
    ]);
    // if (error) return res.status(500).json({ error: error.message });
    } catch (err) {
      console.error("SUBMISSION ERROR:", err);
      return res.status(500).json({ error: err.reason || err.message });
    }

    res.json({
      message: "FIR evidence uploaded and recorded on-chain",
      cid,
      evidenceId,
      filename: file.originalname,
    });

    res.json({
      message: "FIR evidence uploaded and recorded on-chain",
      cid,
      filename: file.originalname,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "FIR upload failed: " + (err.reason || err.message) });
  }
});

// 3. Promote FIR to Case
app.post("/fir/:firId/promote", async (req, res) => {
  try {
    const { firId } = req.params;
    const { caseId, title, type, description, tags } = req.body;

    if (!firId || !caseId || !title || !description || !type)
      return res.status(400).json({ error: "Missing required data" });
    console.log("PROMOTE: FIR ID =", firId);
    console.log(
      "PROMOTE: Raw FIR ID chars:",
      Array.from(firId).map((c) => c.charCodeAt(0)),
    );
    console.log("PROMOTE: CASE ID =", caseId);
    console.log(
      "PROMOTE: Raw CASE ID chars:",
      Array.from(caseId).map((c) => c.charCodeAt(0)),
    );
    const tx = await contract.createCaseFromFIR(
      caseId,
      firId,
      title,
      description,
      tags || [],
    );
    await tx.wait();
    const { error: supaError } = await supabase
      .from("evidence1")
      .update({ container_id: caseId })
      .eq("container_id", firId);

    const { data, select_error } = await supabase
      .from("fir")
      .select("filed_by")
      .eq("fir_id", firId)
      .single();

    if (select_error) {
      console.error(select_error);
    } else {
      console.log("Filed by:", data.filed_by); // ← access value here
    }

    // Upsert FIR in Supabase
    const { error } = await supabase.from("cases").upsert(
      [
        {
          case_id: caseId,
          title: title,
          type: type,
          description: description,
          filed_by: data.filed_by,
          tags: tags,
          fir_id: firId,
        },
      ],
      { onConflict: ["case_id"] },
    );
    const {error: supaFirUpdateError} = await supabase.from("fir").update(
      { status: "promoted" }
    ).eq("fir_id", firId);

    if(supaFirUpdateError){
      console.error("Supabase FIR status update failed:", supaFirUpdateError.message);
    }

    if (error) {
      console.error("Supabase Case upsert failed:", error.message);
      return res.status(500).json({
        error: "Failed to store Case in Supabase",
        details: error.message,
      });
    }

    if (supaError) {
      console.error("Supabase update failed:", supaError);
      return res.status(500).json({
        error: "FIR promoted but database update failed",
        details: supaError,
      });
    }

    console.log("Checking FIR & CASE evidence count after promotion...");
    console.log("FIR:", (await contract.evidenceCount(firId)).toString());
    console.log("CASE:", (await contract.evidenceCount(caseId)).toString());
    res.json({ message: "FIR promoted to case successfully", caseId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
});

// 4. Submit Case Evidence
app.post("/case/:caseId/upload", upload.single("file"), async (req, res) => {
  try {
    const { caseId } = req.params;
    const { evidenceType } = req.body;
    const evidenceId = crypto.randomUUID();
    const {
      description = null,
      deviceSource = null,
      location = null,
    } = req.body;
    const file = req.file;
    const evidenceTypeNum = EvidenceType[evidenceType];
    // if (evidenceTypeNum === undefined) {
    //   return res.status(400).json({ error: "Invalid evidenceType" });
    // }

    console.log(evidenceType);
    console.log("evidenceTypeNum:", evidenceTypeNum);
    if (
      !Number.isFinite(evidenceTypeNum) ||
      ![0, 1, 2, 3].includes(evidenceTypeNum)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or missing evidenceType. Expected 0|1|2|3" });
    }

    if (!file || !evidenceId) {
      return res
        .status(400)
        .json({ error: "Missing required data (file or evidenceId)" });
    }
    const allowed = MIME_GROUPS[evidenceTypeNum];
    if (!allowed.includes(file.mimetype)) {
      return res.status(400).json({
        error: `Invalid file type. Only ${allowed.join(
          ", ",
        )} allowed for this evidence type.`,
      });
    }
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encryptedFile = Buffer.concat([
      cipher.update(file.buffer),
      cipher.final(),
    ]);

    const formData = new FormData();
    formData.append("file", encryptedFile, { filename: `${evidenceId}.bin` });
    const pinataMetadata = {
      name: file.originalname,
    };
    formData.append("pinataMetadata", JSON.stringify(pinataMetadata));

    const ipfsResp = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: { Authorization: `Bearer ${PJWT}`, ...formData.getHeaders() },
      },
    );
    const cid = ipfsResp.data.IpfsHash;

    const hashOriginal = crypto
      .createHash("sha256")
      .update(file.buffer)
      .digest("hex");

    const masterKey = getMasterKeyOrThrow();
    const keyCipher = crypto.createCipheriv("aes-256-cbc", masterKey, iv);
    const keyEncrypted = Buffer.concat([
      keyCipher.update(key),
      keyCipher.final(),
    ]).toString("hex");
    const ivEncrypted = iv.toString("hex");

    const { error } = await supabase.from("evidence1").insert([
      {
        container_id: caseId,
        evidence_id: evidenceId,
        cid: cid,
        hash_original: hashOriginal,
        original_filename: file.originalname,
        key_encrypted: keyEncrypted,
        iv_encrypted: ivEncrypted,
        description: description || null,
        device_source: deviceSource || null,
        collection_location: location || null,
      },
    ]);

    if (error) return res.status(500).json({ error: error.message });

    const tx = await contract.submitCaseEvidence(
      caseId,
      evidenceId,
      cid,
      hashOriginal,
      evidenceTypeNum,
    );
    await tx.wait();

    res.json({
      message: "Case evidence uploaded and recorded on-chain",
      cid,
      evidenceId,
      filename: file.originalname,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Case upload failed: " + err });
  }
});

// 5. Confirm Evidence
app.post("/case/:containerId/confirm", async (req, res) => {
  try {
    // const countFIR = await contract.evidenceCount("FIR-001");
    // const countCase = await contract.evidenceCount("CASE-001");
    // console.log("FIR Count:", countFIR.toString());
    // console.log("Case Count:", countCase.toString());
    const { containerId, index } = req.body;
    const idx = Number(index);
    if (!containerId || idx === undefined)
      return res.status(400).json({ error: "containerId and index required" });

    const tx = await contract.confirmEvidence(containerId, idx);
    await tx.wait();

    res.json({ message: "Evidence confirmed on-chain", containerId, idx });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
});

// 6. Retrieve Evidence (with blockchain verification)
app.get("/retrieve/:containerId/:evidenceId", async (req, res) => {
  try {
    let { containerId, evidenceId } = req.params;
    containerId = containerId.trim();
    evidenceId = evidenceId.trim();

    // Fetch AES key + IV from Supabase
    const { data, error } = await supabase
      .from("evidence1")
      .select("*")
      .eq("container_id", containerId)
      .eq("evidence_id", evidenceId)
      .single();
    if (error || !data) return res.status(404).json({ error });

    const iv = Buffer.from(data.iv_encrypted, "hex");
    const masterKey = getMasterKeyOrThrow();
    const decipher = crypto.createDecipheriv("aes-256-cbc", masterKey, iv);
    const keyBuffer = Buffer.concat([
      decipher.update(Buffer.from(data.key_encrypted, "hex")),
      decipher.final(),
    ]);

    // Fetch CID + hashOriginal from blockchain
    const evidenceOnChain = await contract.getEvidenceById(
      containerId,
      evidenceId,
    );
    const cid = evidenceOnChain.cid;
    const hashOriginal = evidenceOnChain.hashOriginal;

    // Fetch encrypted file from IPFS
    const fileResp = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      { responseType: "arraybuffer" },
    );
    const encryptedFile = Buffer.from(fileResp.data);

    // Decrypt
    const fileDecipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
    const decrypted = Buffer.concat([
      fileDecipher.update(encryptedFile),
      fileDecipher.final(),
    ]);

    // Verify hash
    const hashCheck = crypto
      .createHash("sha256")
      .update(decrypted)
      .digest("hex");
    if (hashCheck !== hashOriginal) {
      console.error(
        "Hash mismatch: evidence file may be tampered or corrupted.",
      );
      return res.status(403).json({
        error:
          "Evidence integrity verification failed. Download not permitted.",
      });
    } else {
      console.log("Hash verified: evidence integrity intact.");
    }

    // Try to get original filename from Pinata metadata
    let originalFilename = null;
    try {
      originalFilename = await getPinnedFilenameFromPinata(cid);
    } catch (metaErr) {
      console.warn("Pinata metadata lookup failed:", metaErr.message);
    }

    if (!originalFilename) {
      originalFilename = evidenceId;
    } else {
      if (!/\.[a-zA-Z0-9]{1,8}$/.test(originalFilename)) {
        const ext = mime.extension("application/octet-stream") || "bin";
        originalFilename = `${originalFilename}.${ext}`;
      }
    }

    originalFilename = sanitizeFilename(originalFilename);

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${originalFilename}"; filename*=UTF-8''${encodeURIComponent(
        originalFilename,
      )}`,
    );
    res.send(decrypted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Retrieve failed: " + err.message });
  }
});

// 7. Sync endpoint - Verify off-chain vs on-chain evidence integrity
app.get("/sync", async (req, res) => {
  try {
    const { data: records, error } = await supabase
      .from("evidence1")
      .select("*");
    if (error) return res.status(500).json({ error: error.message });
    if (!records || records.length === 0)
      return res.json({ message: "No evidence records found" });

    const results = [];
    for (const record of records) {
      const { container_id, evidence_id, key_encrypted, iv_encrypted } = record;
      try {
        const evidenceOnChain = await contract.getEvidenceById(
          container_id,
          evidence_id,
        );
        if (!evidenceOnChain) {
          results.push({
            container_id,
            evidence_id,
            status: "missing_on_chain",
          });
          continue;
        }

        const cid = evidenceOnChain.cid;
        const hashOriginal = evidenceOnChain.hashOriginal;

        const fileResp = await axios.get(
          `https://gateway.pinata.cloud/ipfs/${cid}`,
          { responseType: "arraybuffer" },
        );
        const encryptedFile = Buffer.from(fileResp.data);

        const iv = Buffer.from(iv_encrypted, "hex");
        const masterKey = getMasterKeyOrThrow();
        const decipher = crypto.createDecipheriv("aes-256-cbc", masterKey, iv);
        const keyBuffer = Buffer.concat([
          decipher.update(Buffer.from(key_encrypted, "hex")),
          decipher.final(),
        ]);

        const fileDecipher = crypto.createDecipheriv(
          "aes-256-cbc",
          keyBuffer,
          iv,
        );
        const decrypted = Buffer.concat([
          fileDecipher.update(encryptedFile),
          fileDecipher.final(),
        ]);

        const computedHash = crypto
          .createHash("sha256")
          .update(decrypted)
          .digest("hex");
        const status =
          computedHash === hashOriginal ? "valid" : "hash_mismatch";

        results.push({ container_id, evidence_id, cid, status });
      } catch (innerErr) {
        console.error(
          `Sync error for ${record.evidence_id}:`,
          innerErr.message,
        );
        results.push({
          container_id: record.container_id,
          evidence_id: record.evidence_id,
          status: "error",
          error: innerErr.message,
        });
      }
    }

    const summary = {
      total: results.length,
      valid: results.filter((r) => r.status === "valid").length,
      corrupted: results.filter((r) => r.status === "hash_mismatch").length,
      missing_on_chain: results.filter((r) => r.status === "missing_on_chain")
        .length,
      errors: results.filter((r) => r.status === "error").length,
    };

    res.json({ summary, details: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sync failed: " + err.message });
  }
});

// 8. Verify single evidence
app.get("/verify/:containerId/:evidenceId", async (req, res) => {
  try {
    let { containerId, evidenceId } = req.params;
    containerId = containerId.trim();
    evidenceId = evidenceId.trim();

    // 1. Fetch record from Supabase
    const { data, error } = await supabase
      .from("evidence1")
      .select("*")
      .eq("container_id", containerId)
      .eq("evidence_id", evidenceId)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Evidence not found" });
    }

    // 2. Decrypt AES key
    const iv = Buffer.from(data.iv_encrypted, "hex");
    const masterKey = getMasterKeyOrThrow();
    const decipher = crypto.createDecipheriv("aes-256-cbc", masterKey, iv);

    const keyBuffer = Buffer.concat([
      decipher.update(Buffer.from(data.key_encrypted, "hex")),
      decipher.final(),
    ]);

    // 3. Get blockchain record
    const onChain = await contract.getEvidenceById(containerId, evidenceId);
    const cid = onChain.cid;
    const hashOriginal = onChain.hashOriginal;

    // 4. Fetch encrypted file
    const fileResp = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      { responseType: "arraybuffer" }
    );

    // 5. Decrypt file
    const fileDecipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
    const decrypted = Buffer.concat([
      fileDecipher.update(Buffer.from(fileResp.data)),
      fileDecipher.final(),
    ]);

    // 6. Verify hash
    const computedHash = crypto
      .createHash("sha256")
      .update(decrypted)
      .digest("hex");

    if (computedHash !== hashOriginal) {
      return res.json({
        evidence_id: evidenceId,
        status: "hash_mismatch",
      });
    }

    return res.json({
      evidence_id: evidenceId,
      status: "valid",
    });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({
      evidence_id: req.params.evidenceId,
      status: "error",
      error: err.message,
    });
  }
});


// Start server
const PORT = process.env.PORT || 4000;
const server = app
  .listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
    console.log("Environment:", process.env.NODE_ENV || "development");
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
  });
