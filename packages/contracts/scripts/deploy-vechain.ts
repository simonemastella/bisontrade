import { ethers } from 'hardhat';

async function main() {
  const bgv1 = await ethers.deployContract('BisonGatewayV1');

  console.log(`🚀 BGv1 deployed to: ${await bgv1.getAddress()}`);

  await bgv1.whitelistToken('0x0000000000000000000000000000456E65726779', true);
  await bgv1.whitelistToken(ethers.ZeroAddress, true);
  await bgv1.whitelistToken('0xbf64cf86894ee0877c4e7d03936e35ee8d8b864f', true);
  console.log('Token whitelist successfull');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
