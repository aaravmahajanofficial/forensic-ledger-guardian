import express from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const app = express();
const upload = multer();

app.get("/", (req, res) => {
  res.send(" IPFS Backend is running! Use POST /upload to add files.");
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

  
    console.log(" File received:", req.file.originalname);

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


app.listen(4000, () => {
  console.log("Backend running at http://localhost:4000");
});
