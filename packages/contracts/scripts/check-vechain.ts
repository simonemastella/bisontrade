import { ethers } from 'hardhat';
import { BisonGatewayV1 } from '../typechain-types';
import { expect } from 'chai';

async function main() {
  const bgv1 = (await ethers.getContractAt(
    'BisonGatewayV1',
    '0xbc330b7960c77b0443006a341edfd0507adf2e87'
  )) as BisonGatewayV1;

  expect(
    await bgv1.tokenAllowList('0x0000000000000000000000000000456E65726779')
  ).to.be.true;
  expect(await bgv1.tokenAllowList(ethers.ZeroAddress)).to.be.true;
  expect(
    await bgv1.tokenAllowList('0xbf64cf86894ee0877c4e7d03936e35ee8d8b864f')
  ).to.be.true;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
