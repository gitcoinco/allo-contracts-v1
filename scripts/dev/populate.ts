import hre, { ethers } from "hardhat";

async function main() {
  console.log("🟡 Creating projects");

  if (hre.network.name !== "dev") {
    console.error("This script can only be use in local dev environments");
    process.exit(1);
  }

  let account;
  let accountAddress;

  account = (await ethers.getSigners())[0];
  accountAddress = await account.getAddress();

  console.log("This script populates the local chain");

  const projectRegistry = await ethers.getContractAt(
    "ProjectRegistry",
    "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    account
  );

  await projectRegistry.createProject({
    protocol: 1,
    pointer: "QmWnDfdggaDkoQQ1r8fSUr6f2yN25ERqAtbYbDtdxTrvUx",
  });

  console.log("✅ Projects created");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
