import { abi, address } from "./constants.js";

const toggleConnection = (connected) => {
	if (connected) {
		$("#connect-button").val("Connected").prop("disabled", true);
		$("#fundme-not-connected").hide();
		$("#fundme-actions").show();
	} else {
		$("#fundme-actions").hide();
		$("#fundme-not-connected").show();
	}
};

const connect = async () => {
	$("#loading").show();
	if (window.ethereum) {
		try {
			await window.ethereum.request({ method: "eth_requestAccounts" });
			toggleConnection(true);
		} catch (err) {}
	} else $("#connect-button").val("Metamask not found");
	$("#loading").hide();
};

const fund = async () => {
	$("#loading").show();
	$("input").prop("disabled", true);
	$("#fundme-message").html("");
	const ethAmount = $("#eth-amount-input").val();
	if (window.ethereum && ethAmount) {
		try {
			/* get the provider i.e metamask */
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			/* get the account/signer */
			const signer = provider.getSigner();
			/* connect to contract */
			const contract = new ethers.Contract(address, abi, signer);

			/* send fund transaction */
			const txnResponse = await contract.fund({
				value: ethers.utils.parseEther(ethAmount),
			});
			await listenTxnMining(txnResponse, provider);
			getBalance();
			$("#fundme-message")
				.html(`Funded ${ethAmount} ETH`)
				.css("color", "#14DC5D");
			$("#eth-amount-input").val("");
		} catch (err) {
			$("#fundme-message").css("color", "#DC143C");
			if (err.message.includes("You need to spend more ETH!"))
				$("#fundme-message").html("Send more ETH");
			else if (
				err.message ===
				"MetaMask Tx Signature: User denied transaction signature."
			)
				$("#fundme-message").html("Transaction declined");
			else $("#fundme-message").html("Transaction error");
		}
	}
	$("#loading").hide();
};

const withdraw = async () => {
	$("#loading").show();
	$("input").prop("disabled", true);
	$("#fundme-message").html("");
	if (window.ethereum) {
		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(address, abi, signer);

			const txnResponse = await contract.withdraw();
			await listenTxnMining(txnResponse, provider);
			getBalance();
			$("#fundme-message")
				.html("Amount withdrawn")
				.css("color", "#14DC5D");
		} catch (err) {
			$("#fundme-message").css("color", "#DC143C");
			if (err.message.includes("FundMe__NotOwner()"))
				$("#fundme-message").html("Not allowed to withdraw");
			else if (
				err.message ===
				"MetaMask Tx Signature: User denied transaction signature."
			)
				$("#fundme-message").html("Transaction declined");
			else $("#fundme-message").html("Transaction error");
		}
	}
	$("#loading").hide();
};

const listenTxnMining = (txnResponse, provider) => {
	return new Promise((resolve, reject) => {
		provider.once(txnResponse.hash, (txnReceipt) => {
			resolve();
		});
	});
};

const getBalance = async () => {
	if (window.ethereum) {
		try {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const totalAmount = ethers.utils.formatEther(
				await provider.getBalance(address)
			);
			$("#amount-funded").html(
				`Total Amount Funded <span>${totalAmount} ETH</span>`
			);
		} catch (err) {}
	}
};

$("#loading").hide();

getBalance();

$("#connect-button").click(connect);
$("#fund-button").click(fund);
$("#withdraw-button").click(withdraw);
