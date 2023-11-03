
const hre = require("hardhat");

async function main() {

  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const VotingContract_ = await VotingContract.deploy();

  await VotingContract_.deployed();

  console.log("Lock deployed to:", VotingContract_.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
