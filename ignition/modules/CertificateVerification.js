const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
module.exports = buildModule("CertificateVerificationModule", (m) => {

  const lock = m.contract("CertificateVerification");

  return { lock };
});
