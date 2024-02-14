// This script deals with deploying the MerklePayoutStrategyFactory on a given network
import hre, { ethers, upgrades } from "hardhat";
import { confirmContinue, getBlocksToWait } from "../../../utils/script-utils";
import * as utils from "../../utils";

utils.assertEnvironment();

export async function main() {
  await confirmContinue({
    contract: "MerklePayoutStrategyFactory",
    network: hre.network.name,
    chainId: hre.network.config.chainId,
  });

  // Deploy MerklePayoutStrategyFactory
  const contractFactory = await ethers.getContractFactory(
    "MerklePayoutStrategyFactory"
  );
  const contract = await upgrades.deployProxy(contractFactory);
  const address = await contract.getAddress();

  console.log(`Deploying Upgradable MerklePayoutStrategyFactory to ${address}`);

  const resp = contract.deploymentTransaction();
  await resp.wait(getBlocksToWait(hre.network.name));

  console.log("✅ Deployed.");

  return address;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
