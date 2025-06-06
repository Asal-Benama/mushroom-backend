const express = require("express");
const cors = require("cors");
const { getGateway } = require("./gateway");

const app = express();
app.use(cors());

app.get("/api/trace/:batchId", async (req, res) => {
  const { batchId } = req.params;

  try {
    const gateway = await getGateway();
    const network = await gateway.getNetwork("mushroomchannel");
    const contract = network.getContract("mushroomcontract");

    const result = await contract.evaluateTransaction("GetBatchHistory", batchId);
    const history = JSON.parse(result.toString());

    res.json({ batchId, history });
  } catch (err) {
    console.error("Blockchain query failed:", err);
    res.status(500).json({ error: "Failed to retrieve batch from blockchain" });
  }
});

app.listen(3001, () => console.log("✅ Backend running on port 3001"));

