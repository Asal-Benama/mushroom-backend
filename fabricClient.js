const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

async function getGatewayContract() {
  const ccpPath = path.resolve(__dirname, "connection-farmorg.json");
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

  const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, "wallet"));
  const identity = await wallet.get("appUser");

  if (!identity) throw new Error("appUser identity not found in wallet");

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "appUser",
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork("mushroomchannel");
  return network.getContract("mushroomcontract");
}

module.exports = { getGatewayContract };

