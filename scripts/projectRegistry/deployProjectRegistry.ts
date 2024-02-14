import hre, { ethers, upgrades } from "hardhat";
import { LedgerSigner } from "@anders-t/ethers-ledger";
import { confirmContinue, prettyNum } from "../../utils/script-utils";

export async function main() {
  const network = await ethers.provider.getNetwork();
  const networkName = await hre.network.name;
  let account;
  let accountAddress;

  if (process.env.USE_HARDWARE_WALLET === "true") {
    // with hardware wallet
    console.log("Waiting for hardware wallet to connect...");
    account = new LedgerSigner(hre.ethers.provider as any);
  } else {
    // default without hardware wallet
    account = (await ethers.getSigners())[0];
  }

  accountAddress = await account.getAddress();
  const balance = await ethers.provider.getBalance(accountAddress);

  console.log(
    `This script deploys the ProjectRegistry contract on ${networkName}`
  );

  await confirmContinue({
    contract: "ProjectRegistry",
    chainId: network.chainId,
    network: network.name,
    account: accountAddress,
    balance: prettyNum(balance.toString()),
  });

  console.log("Deploying ProjectRegistry...");

  const ProjectRegistry = await ethers.getContractFactory(
    "ProjectRegistry",
    account
  );
  const instance = await upgrades.deployProxy(ProjectRegistry, []);
  const resp = instance.deploymentTransaction();
  const address = await instance.getAddress();

  const rec = await resp.wait();
  const gas = prettyNum(rec.gasUsed.toString());
  console.log(`gas used: ${gas}`);

  console.log("ProjectRegistry deployed to:", address);

  return address;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
