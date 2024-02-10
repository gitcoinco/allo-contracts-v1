// This script deals with deploying QuadraticFundingVotingStrategyImplementation on a given network
import { ethers } from "hardhat";
import hre from "hardhat";
import { confirmContinue, getBlocksToWait } from "../../../utils/script-utils";
import * as utils from "../../utils";

utils.assertEnvironment();

export async function main() {
  await confirmContinue({
    contract: "QuadraticFundingVotingStrategyImplementation",
    network: hre.network.name,
    chainId: hre.network.config.chainId,
  });

  // Deploy QFImplementation
  const contractFactory = await ethers.getContractFactory(
    "QuadraticFundingVotingStrategyImplementation"
  );
  const contract = await contractFactory.deploy();
  const resp = contract.deploymentTransaction();
  const address = await contract.getAddress();

  console.log(`Deploying QuadraticFundingVotingStrategyImplementation to ${address}`);
  await resp.wait(getBlocksToWait(hre.network.name));
  console.log("✅ Deployed.");

  return contract.address;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
