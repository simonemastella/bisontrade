import { ethers } from 'hardhat';

async function main() {
  const bgv1 = await ethers.deployContract('BisonGatewayV1');

  console.log(`🚀 BGv1 deployed to: ${await bgv1.getAddress()}`);
  await bgv1.whitelistToken(ethers.ZeroAddress, true);
  await bgv1.whitelistToken('0x8d9cb8f3191Fd685e2C14D2AC3Fb2b16D44EAfc3', true); //usdt
  await bgv1.whitelistToken('0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897', true); //usdc
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
