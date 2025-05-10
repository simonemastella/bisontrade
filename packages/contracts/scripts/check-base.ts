import { ethers } from 'hardhat';
import { BisonGatewayV1 } from '../typechain-types';
import { expect } from 'chai';

async function main() {
  const bgv1 = (await ethers.getContractAt(
    'BisonGatewayV1',
    '0xd607f2AAB740ced2d80311Cd4d94bac38440940c'
  )) as BisonGatewayV1;

  expect(await bgv1.tokenAllowList(ethers.ZeroAddress)).to.be.true;
  expect(
    await bgv1.tokenAllowList('0x8d9cb8f3191Fd685e2C14D2AC3Fb2b16D44EAfc3')
  ).to.be.true;
  expect(
    await bgv1.tokenAllowList('0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897')
  ).to.be.true;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
