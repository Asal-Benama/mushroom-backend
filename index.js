const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

app.get("/api/trace/:batchId", (req, res) => {
  const filePath = path.join(__dirname, "data", `${req.params.batchId}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Batch not found" });
  }
  const data = fs.readFileSync(filePath, "utf8");
  res.json(JSON.parse(data));
});

app.listen(3001, () => console.log("✅ Backend running on port 3001"));

