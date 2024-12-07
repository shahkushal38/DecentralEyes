const { ethers } = require("hardhat");

async function main() {
    const ToolRegistry = await ethers.getContractFactory("ToolRegistry");
    const toolRegistry = await ToolRegistry.deploy();
    await toolRegistry.deployed();
    console.log("ToolRegistry deployed to:", toolRegistry.address);

    const UserVerification = await ethers.getContractFactory("UserVerification");
    const userVerification = await UserVerification.deploy();
    await userVerification.deployed();
    console.log("UserVerification deployed to:", userVerification.address);

    const ReviewManager = await ethers.getContractFactory("ReviewManager");
    const reviewManager = await ReviewManager.deploy(
        toolRegistry.address,
        userVerification.address
    );
    await reviewManager.deployed();
    console.log("ReviewManager deployed to:", reviewManager.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
