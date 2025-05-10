import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';
import { expect } from 'chai';
describe('BisonGatewatV1', function () {
  async function deployBGv1Fixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const users = [addr1, addr2].map((a) => a.address);

    const BGv1 = await ethers.deployContract('BisonGatewayV1');
    const factory = await ethers.getContractFactory('MyToken');
    const WhitelistedToken = await factory.deploy(owner.address);
    await WhitelistedToken.waitForDeployment();
    const NonWhitelistedToken = await factory.deploy(owner.address);
    await NonWhitelistedToken.waitForDeployment();
    await WhitelistedToken.mint(
      users,
      users.map((_) => ethers.parseEther('100'))
    );
    await NonWhitelistedToken.mint(
      users,
      users.map((_) => ethers.parseEther('100'))
    );
    await BGv1.whitelistToken(await WhitelistedToken.getAddress(), true);
    await BGv1.whitelistToken(ethers.ZeroAddress, true);
    return { BGv1, owner, addr1, addr2, WhitelistedToken, NonWhitelistedToken };
  }

  it('Should assign the ownership of the contract only to the deployer', async function () {
    const { BGv1, owner, addr1 } = await loadFixture(deployBGv1Fixture);
    const adminRole = await BGv1.DEFAULT_ADMIN_ROLE();

    expect(await BGv1.hasRole(adminRole, owner.address)).to.be.true;
    expect(await BGv1.hasRole(adminRole, addr1.address)).to.be.false;
  });

  describe('deposit', async () => {
    it('should allow to deposit a whitelisted erc20 token', async () => {
      const { BGv1, addr1, WhitelistedToken } =
        await loadFixture(deployBGv1Fixture);
      await WhitelistedToken.connect(addr1).approve(
        await BGv1.getAddress(),
        ethers.parseEther('50')
      );
      await expect(
        BGv1.connect(addr1).depositERC20(
          await WhitelistedToken.getAddress(),
          ethers.parseEther('50'),
          1
        )
      )
        .to.emit(BGv1, 'Deposit')
        .withArgs(
          await WhitelistedToken.getAddress(),
          ethers.parseEther('50'),
          1,
          addr1.address
        );
    });

    it('should not allow to deposit a non-whitelisted erc20 token', async () => {
      const { BGv1, addr1, NonWhitelistedToken } =
        await loadFixture(deployBGv1Fixture);
      await expect(
        BGv1.connect(addr1).depositERC20(
          await NonWhitelistedToken.getAddress(),
          ethers.parseEther('50'),
          1
        )
      ).to.be.revertedWith('Token not whitelisted');
    });

    it('should not allow to deposit an amount of zero token', async () => {
      const { BGv1, addr1, WhitelistedToken } =
        await loadFixture(deployBGv1Fixture);
      await expect(
        BGv1.connect(addr1).depositERC20(
          await WhitelistedToken.getAddress(),
          0,
          1
        )
      ).to.be.revertedWithCustomError(BGv1, 'DepositZeroAmount');
      await expect(
        BGv1.connect(addr1).deposit(1)
      ).to.be.revertedWithCustomError(BGv1, 'DepositZeroAmount');
    });

    it('should not allow to deposit erc20 token when the transferFrom returns an error', async () => {
      const { BGv1, addr1, owner } = await loadFixture(deployBGv1Fixture);

      const factory = await ethers.getContractFactory(
        'MyTokenWithFailTransfer'
      );
      const FailingToken = await factory.deploy(owner.address);
      await FailingToken.waitForDeployment();
      await BGv1.connect(owner).whitelistToken(
        await FailingToken.getAddress(),
        true
      );
      await FailingToken.connect(owner).mint(
        [addr1.address],
        [ethers.parseEther('50')]
      );
      await FailingToken.connect(addr1).approve(
        await BGv1.getAddress(),
        ethers.parseEther('50')
      );
      await expect(
        BGv1.connect(addr1).depositERC20(
          await FailingToken.getAddress(),
          ethers.parseEther('50'),
          1
        )
      ).to.be.revertedWithCustomError(BGv1, 'DepositFailed');
    });

    it('should allow to deposit native token only when whitelisted', async () => {
      const { BGv1, addr1 } = await loadFixture(deployBGv1Fixture);
      await expect(
        BGv1.connect(addr1).deposit(1, { value: ethers.parseEther('50') })
      )
        .to.emit(BGv1, 'Deposit')
        .withArgs(
          ethers.ZeroAddress,
          ethers.parseEther('50'),
          1,
          addr1.address
        );
      await BGv1.whitelistToken(ethers.ZeroAddress, false);
      await expect(
        BGv1.connect(addr1).deposit(1, { value: ethers.parseEther('50') })
      ).to.be.revertedWith('Token not whitelisted');
    });
  });

  describe('withdraw', async () => {
    it('should allow only admin to call a withdraw', async () => {
      const { BGv1, addr1 } = await loadFixture(deployBGv1Fixture);
      await expect(
        BGv1.connect(addr1).whitelistToken(ethers.ZeroAddress, true)
      ).to.be.revertedWithCustomError(BGv1, 'AccessControlUnauthorizedAccount');
      await expect(
        BGv1.connect(addr1).withdraw(
          ethers.ZeroAddress,
          ethers.parseEther('100')
        )
      ).to.be.revertedWithCustomError(BGv1, 'AccessControlUnauthorizedAccount');
      await expect(
        BGv1.connect(addr1).withdrawERC20(
          ethers.ZeroAddress,
          addr1.address,
          ethers.parseEther('100')
        )
      ).to.be.revertedWithCustomError(BGv1, 'AccessControlUnauthorizedAccount');
    });

    it('should allow to withdraw funds', async () => {
      const { BGv1, addr1 } = await loadFixture(deployBGv1Fixture);
      await BGv1.deposit(1, { value: 10 });
      await expect(BGv1.withdraw(addr1.address, 10))
        .to.emit(BGv1, 'WithdrawSucceeded')
        .withArgs(ethers.ZeroAddress, 10, addr1.address);
    });

    it('should emit the failure of funds withdraw', async () => {
      const { BGv1, addr1 } = await loadFixture(deployBGv1Fixture);
      await expect(BGv1.withdraw(addr1.address, 10))
        .to.emit(BGv1, 'WithdrawFailed')
        .withArgs(ethers.ZeroAddress, 10, addr1.address, '0x');
    });

    it('should not allow reentrancy', async () => {
      const { BGv1 } = await loadFixture(deployBGv1Fixture);
      await BGv1.deposit(1, { value: 30 });
      const factory = await ethers.getContractFactory('ReentrantReceiver');
      const Reentrancy = await factory.deploy();
      await Reentrancy.waitForDeployment();
      const amountBefore = await ethers.provider.getBalance(
        await Reentrancy.getAddress()
      );
      const selector = ethers
        .keccak256(ethers.toUtf8Bytes('ReentrancyGuardReentrantCall()'))
        .slice(0, 10);

      await expect(BGv1.withdraw(await Reentrancy.getAddress(), 10))
        .to.emit(Reentrancy, 'Loop')
        .withArgs(1, selector);
      const amountAfter = await ethers.provider.getBalance(
        await Reentrancy.getAddress()
      );
      expect(amountAfter).to.be.equal(amountBefore + 10n);
    });

    it('should allow to withdraw funds', async () => {
      const { BGv1, WhitelistedToken, addr1, owner } =
        await loadFixture(deployBGv1Fixture);
      await WhitelistedToken.mint([await BGv1.getAddress()], [100n]);
      await expect(
        BGv1.withdrawERC20(
          await WhitelistedToken.getAddress(),
          addr1.address,
          10
        )
      )
        .to.emit(BGv1, 'WithdrawSucceeded')
        .withArgs(await WhitelistedToken.getAddress(), 10, addr1.address);

      const factory = await ethers.getContractFactory(
        'MyTokenWithFailTransfer'
      );
      const FailingToken = await factory.deploy(owner.address);
      await FailingToken.waitForDeployment();
      await BGv1.connect(owner).whitelistToken(
        await FailingToken.getAddress(),
        true
      );
      await FailingToken.connect(owner).mint(
        [addr1.address],
        [ethers.parseEther('50')]
      );

      await expect(
        BGv1.withdrawERC20(await FailingToken.getAddress(), addr1.address, 10)
      )
        .to.emit(BGv1, 'WithdrawFailed')
        .withArgs(await FailingToken.getAddress(), 10, addr1.address, '0x');
    });

    it('should not allow ERC20 reentrancy', async () => {
      const { BGv1, WhitelistedToken, addr1 } =
        await loadFixture(deployBGv1Fixture);

      //deploy of the fake token
      const factory = await ethers.getContractFactory('MyTokenReentrant');
      const Reentrancy = await factory.deploy(
        await WhitelistedToken.getAddress()
      );
      await Reentrancy.waitForDeployment();

      //mint both
      await Reentrancy.mint([await BGv1.getAddress()], [100n]);
      await WhitelistedToken.mint([await BGv1.getAddress()], [100n]);
      const selector = ethers
        .keccak256(ethers.toUtf8Bytes('ReentrancyGuardReentrantCall()'))
        .slice(0, 10);
      await expect(
        BGv1.withdrawERC20(await Reentrancy.getAddress(), addr1.address, 10)
      )
        .to.emit(Reentrancy, 'Scam')
        .withArgs(false, selector);
    });
  });
});
