const { Gateway, Wallets, X509Identity } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function getGateway() {
  const ccpPath = path.resolve(__dirname, 'connection', 'connection-org1.json');
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  const wallet = await Wallets.newInMemoryWallet();

  const cert = fs.readFileSync(path.join(__dirname, 'wallet', 'admin.id', 'cert.pem')).toString();
  const key = fs.readFileSync(path.join(__dirname, 'wallet', 'admin.id', 'key.pem')).toString();

  const identity = {
    credentials: {
      certificate: cert,
      privateKey: key,
    },
    mspId: 'Org1MSP', // Important: match your org MSP ID
    type: 'X.509',
  };

  await wallet.put('admin', identity);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'admin',
    discovery: { enabled: true, asLocalhost: true },
  });

  return gateway;
}

module.exports = { getGateway };
