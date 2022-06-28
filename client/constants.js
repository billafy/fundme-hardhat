export const address = "0xd16F5AEb8aEC560A3E12Da6c8a6a6FfCb4158dCb";

export const abi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "priceFeed",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{
		inputs: [],
		name: "FundMe__NotOwner",
		type: "error",
	},
	{
		inputs: [],
		name: "MINIMUM_USD",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "fund",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "fundingAddress",
				type: "address",
			},
		],
		name: "getAddressToAmountFunded",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "index",
				type: "uint256",
			},
		],
		name: "getFunder",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getOwner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getPriceFeed",
		outputs: [
			{
				internalType: "contract AggregatorV3Interface",
				name: "",
				type: "address",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "withdraw",
		outputs: [],
		stateMutability: "payable",
		type: "function",
	},
];
