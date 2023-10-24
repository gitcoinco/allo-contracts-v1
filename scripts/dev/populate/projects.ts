import hre, { ethers } from "hardhat";
import fs from "fs";
import path from "path";

const pinataHost = process.env.PINATA_HOST;
const pinataPort = process.env.PINATA_PORT;
const pinataBaseUrl =
  pinataHost !== undefined && pinataPort !== undefined
    ? `http://${pinataHost}:${pinataPort}`
    : undefined;

function loadFixture(name: string): Buffer {
  const p = path.resolve(__dirname, "../fixtures", `${name}`);
  const data = fs.readFileSync(p);
  return data;
}

async function uploadJSONToPinata(b: string) {
  const { IpfsHash } = await fetch(`${pinataBaseUrl}/pinning/pinJSONToIPFS`, {
    method: "POST",
    headers: {
      Origin: "http://localhost",
      "Content-Type": "application/json",
      Authorization: `Bearer development-token`,
    },
    body: b,
  }).then((r) => r.json());

  return IpfsHash;
}

async function uploadFileToPinata(b: Buffer) {
  const body = new FormData();
  body.append("file", new Blob([b]));

  const { IpfsHash } = await fetch(`${pinataBaseUrl}/pinning/pinFileToIPFS`, {
    method: "POST",
    headers: {
      Origin: "http://localhost",
      Authorization: `Bearer development-token`,
    },
    body,
  }).then((r) => r.json());

  return IpfsHash;
}

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

  if (pinataBaseUrl === undefined) {
    return;
  }

  for (let i = 1; i < 3; i++) {
    const logo = loadFixture("images/400x400.svg");
    const logoCid = await uploadFileToPinata(logo);

    const banner = loadFixture("images/1500x500.svg");
    const bannerCid = await uploadFileToPinata(banner);

    const metadata = JSON.parse(loadFixture(`projects/${i}.json`).toString());
    metadata.logoImg = logoCid;
    metadata.bannerImg = bannerCid;

    const metadataCid = await uploadJSONToPinata(JSON.stringify(metadata));
    await projectRegistry.connect(account1).createProject({
      protocol: 1,
      pointer: metadataCid,
    });
  }

  console.log("✅ Projects created");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
