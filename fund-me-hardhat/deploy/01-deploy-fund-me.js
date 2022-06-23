const { network } = require("hardhat");
const {
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} = require("../helper-hardhat-config.js");
const verify = require("../utils/verify");

module.exports = async ({ deployments, getNamedAccounts }) => {
    const { deploy, log } =
        deployments; /* deploy deploys the contract, log is just console.log */
    const { deployer } =
        await getNamedAccounts(); /* gets the account through which the contract will be deployed */
    const chainId = network.config.chainId; /* chain id of the network */

    /* if it is a development server, deploy mocks */
    let priceFeedAddress = "";
    if (developmentChains.includes(network.name)) {
        const priceFeed = await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        });
        priceFeedAddress = priceFeed.address;
    } /* or use chainlink address */ else
        priceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;

    /* deploy fund me contract */
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [priceFeedAddress],
        waitConfirmations: network.config.blockConfirmations || 1,
        log: true,
    });

    /* verify it on etherscan */
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
    if (!developmentChains.includes(network.name) && ETHERSCAN_API_KEY)
        verify(fundMe.address, [priceFeedAddress]);
};
