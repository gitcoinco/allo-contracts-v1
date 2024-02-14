import { main as deployRegistry } from "../projectRegistry/deployProjectRegistry";

import { main as deployProgramFactory } from "../program/deployProgramFactory";
import { main as deployProgramImplementation } from "../program/deployProgramImplementation";
import { main as linkProgramImplementation } from "../program/linkProgramImplementation";

import { main as deployQFVotingStrategyFactory } from "../votingStrategy/quadraticFunding/deployQFVotingStrategyFactory";
import { main as deployQFVotingStrategyImplementation } from "../votingStrategy/quadraticFunding/deployQFVotingStrategyImplementation";
import { main as linkQFVotingStrategyImplementation } from "../votingStrategy/quadraticFunding/linkQFVotingStrategyImplementation";

import { main as deployMerklePayoutStrategyFactory } from "../payoutStrategy/merkle/deployMerklePayoutStrategyFactory";
import { main as deployMerklePayoutStrategyImplementation } from "../payoutStrategy/merkle/deployMerklePayoutStrategyImplementation";
import { main as linkMerklePayoutStrategyImplementation } from "../payoutStrategy/merkle/linkMerklePayoutStrategyImplementation";

import { main as deployDirectPayoutStrategyFactory } from "../payoutStrategy/direct/deployDirectPayoutStrategyFactory";
import { main as deployDirectPayoutStrategyImplementation } from "../payoutStrategy/direct/deployDirectPayoutStrategyImplementation";
import { main as linkDirectPayoutStrategyImplementation } from "../payoutStrategy/direct/linkDirectPayoutStrategyImplementation";

import { main as deployAlloSettings } from "../settings/deployAlloSettings";
import { main as setProtocolFeeDetails } from "../settings/setProtocolFeeDetails";

import { main as deployRoundFactory } from "../round/deployRoundFactory";
import { main as deployRoundImplementation } from "../round/deployRoundImplementation";
import { main as linkRoundImplementation } from "../round/linkRoundImplementation";
import { main as linkAlloSettings } from "../round/linkAlloSettings";

async function main() {
  const registry = await deployRegistry();

  const programFactory = await deployProgramFactory();
  const programImplementation = await deployProgramImplementation();
  await linkProgramImplementation();

  const qfVotingStrategyFactory = await deployQFVotingStrategyFactory();
  const qfVotingStrategyImplementation =
    await deployQFVotingStrategyImplementation();
  await linkQFVotingStrategyImplementation();

  const merklePayoutStrategyFactory = await deployMerklePayoutStrategyFactory();
  const merklePayoutStrategyImplementation =
    await deployMerklePayoutStrategyImplementation();
  await linkMerklePayoutStrategyImplementation();

  const directPayoutStrategyFactory = await deployDirectPayoutStrategyFactory();
  const directPayoutStrategyImplementation =
    await deployDirectPayoutStrategyImplementation();
  await linkDirectPayoutStrategyImplementation();

  const alloSettings = await deployAlloSettings();
  await setProtocolFeeDetails();

  const roundFactory = await deployRoundFactory();
  const roundImplementation = await deployRoundImplementation();

  await linkRoundImplementation();
  await linkAlloSettings();

  console.log("---------------------------------------");
  console.log("\nAllo V1 contracts deployed successfully\n");
  console.table({
    Registry: registry,
    ProgramFactory: programFactory,
    ProgramImplementation: programImplementation,
    QFVotingStrategyFactory: qfVotingStrategyFactory,
    QFVotingStrategyImplementation: qfVotingStrategyImplementation,
    MerklePayoutStrategyFactory: merklePayoutStrategyFactory,
    MerklePayoutStrategyImplementation: merklePayoutStrategyImplementation,
    DirectPayoutStrategyFactory: directPayoutStrategyFactory,
    DirectPayoutStrategyImplementation: directPayoutStrategyImplementation,
    AlloSettings: alloSettings,
    RoundFactory: roundFactory,
    RoundImplementation: roundImplementation,
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
