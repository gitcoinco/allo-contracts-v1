import hre, { ethers } from "hardhat";

async function main() {
  console.log("🟡 Creating projects");

  const [account1, account2] = await ethers.getSigners();

  if (hre.network.name !== "dev") {
    console.error("This script can only be use in local dev environments");
    process.exit(1);
  }

  console.log("This script populates the local chain");
  const projectRegistry = await ethers.getContractAt(
    "ProjectRegistry",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
  );

  await projectRegistry.connect(account1).createProject({
    protocol: 1,
    pointer: "QmbxFwXhyTBVfxS5zDhKVB6GmdzcQRUNyTHbRNnxQ2iqDB",
  });

  await projectRegistry.connect(account1).createProject({
    protocol: 1,
    pointer: "QmfXWmPeVHFk8UKRQp6gqfV5MDKj25W1AVtpHRi18nDkPG",
  });

  await projectRegistry.connect(account2).createProject({
    protocol: 1,
    pointer: "QmPfuocTLNvBPqrCbTbQ4wV7tigFRkGVjKYj8ai9kPeUga",
  });

  console.log("✅ Projects created");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
