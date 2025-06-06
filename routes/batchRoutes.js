const express = require('express');
const router = express.Router();
const { getGateway } = require('../gateway');

router.get('/batch/:batchId', async (req, res) => {
  const { batchId } = req.params;
  try {
    const gateway = await getGateway();
    const network = await gateway.getNetwork('mushroomchannel');
    const contract = network.getContract('mushroomcontract');

    const result = await contract.evaluateTransaction('GetBatchHistory', batchId);
    const history = JSON.parse(result.toString());

    res.json({ batchId, history });
  } catch (error) {
    console.error('Blockchain error:', error);
    res.status(500).json({ error: 'Failed to fetch batch data' });
  }
});

module.exports = router;
