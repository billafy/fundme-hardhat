const { run } = require("hardhat");

module.exports = async (address, constructorArguments) => {
	try {
		await run("verify:verify", {
			address,
			constructorArguments,
		});
		console.log('verified');
	} catch (err) {
		console.error(err);
	}
};