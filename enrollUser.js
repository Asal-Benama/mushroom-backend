const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

async function main() {
  try {
    const ccpPath = path.resolve(__dirname, "connection-farmorg.json");
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const caURL = ccp.certificateAuthorities["ca.farmorg.example.com"].url;
    const ca = new FabricCAServices(caURL);

    const walletPath = path.join(__dirname, "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if appUser exists
    const userExists = await wallet.get("appUser");
    if (userExists) {
      console.log("An identity for appUser already exists in the wallet");
      return;
    }

    // Check for admin identity
    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      console.log("Admin identity not found. Enroll admin first.");
      return;
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    // Register and enroll appUser
    const secret = await ca.register(
      {
        affiliation: "farmorg.department1",
        enrollmentID: "appUser",
        role: "client",
      },
      adminUser
    );

    const enrollment = await ca.enroll({
      enrollmentID: "appUser",
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "FarmOrgMSP",
      type: "X.509",
    };

    await wallet.put("appUser", x509Identity);
    console.log("✅ Successfully enrolled appUser and imported into the wallet");
  } catch (error) {
    console.error("❌ Failed to enroll appUser:", error);
  }
}

main();
