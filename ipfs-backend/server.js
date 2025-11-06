import express from 'express';
import multer from 'multer';
import axios from 'axios';
import { CID } from 'multiformats/cid';
import dotenv from 'dotenv';
import FormData from 'form-data';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://127.0.0.1:5173', 'http://127.0.0.1:8080'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "IPFS Backend is running!",
    endpoints: {
      upload: "POST /upload",
      retrieve: "GET /retrieve/:cid"
    }
  });
});

// File upload endpoint
app.post("/upload", (req, res, next) => {
  console.log("Upload request received");
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("Request received:", {
      body: req.body,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : null,
      headers: req.headers
    });
    
    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", req.file.originalname);
    
    if (!req.body.caseId || !req.body.evidenceId || req.body.evidenceType === undefined) {
      console.error("Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const data = new FormData();
    data.append("file", req.file.buffer, req.file.originalname);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: Infinity, 
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`, 
          ...data.getHeaders(),
        },
      }
    );

    const cid = response.data.IpfsHash;
    console.log("Pinned to IPFS with CID:", cid);

    res.json({ cid });
  } catch (err) {
    console.error("Pinata error:", err.response?.data || err.message);
    res.status(500).json({ error: "Upload failed" });
  }
});


app.get("/retrieve/:cid", async (req, res) => {
  const { cid } = req.params;

// Strict CID validation using multiformats/cid
function validateCid(cid) {
  try {
    // Ensure cid is a string, does not contain `/`, `.`, or other path-altering chars
    if (typeof cid !== "string") return false;
    if (/[^a-zA-Z0-9]+/.test(cid)) return false; // basic alpha-numeric only
    if (cid.includes('/') || cid.includes('.') || cid.includes('..')) return false;
    // Try parsing as a CID (will throw if invalid)
    CID.parse(cid);
    return true;
  } catch {
    return false;
  }
}

  if (!validateCid(cid)) {
    return res.status(400).json({ error: "Invalid CID" });
  }
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`; 
    const response = await axios.get(url, { responseType: "arraybuffer" });
    
    res.setHeader("Content-Type", response.headers["content-type"]);
    res.send(response.data);
  } catch (err) {
    console.error("Retrieve error:", err.message);
    res.status(500).json({ error: "Retrieve failed" });
  }
});


const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});
