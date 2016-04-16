'use strict'
const _ = require('lodash');

const SnacksRepository = require('./snacksRepository');
const Dispenser = require('./dispenser');
const ChangeCalculator = require('./changeCalculator');

const availableChange = [1, 2, 5, 10, 20, 50, 100, 200]
	.map((value) => { return {value, amount: 0}; });

let repository = new SnacksRepository({});
let changeCalculator = new ChangeCalculator(availableChange);
let dispenser = new Dispenser(repository, changeCalculator);

const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('JerrysSnacks>');


let currentCommand = '';

console.log('Please insert next command, or type ? for help');

rl.on('line', (answer) => {
	let parts = answer.split(/\s+/);	// split on whitespace
	currentCommand = parts.shift().toLowerCase(); // remove the first word, which is the command
		
	switch(currentCommand) {
		case 'x':
		case 'exit':
			rl.close();
		break;
		case 'restock':
		case 'r':
			restock(parts);
			displayStats();
		break;
		case 'load':
		case 'l':
			loadCoins(parts);
			displayStats();
		break;
		case 'select':
		case 's':
			selectSnack(parts);
		break;
		case 'pay':
		case 'p':
			pay(parts);
		break;
		case 'state':
			displayStats();
		break;
		default:
			displayUsage();
		break;
	}
});

//TODO: check the inputs here
//TODO: exception handling
function restock(parts) {
	let id = parts[0];
	let price = parseInt(parts[1]);
	let numItems = parseInt(parts[2]);

	repository.add({id, price}, numItems);
}

function loadCoins(parts) {
	let value = parseInt(parts[0]);
	let amount = parseInt(parts[1]);
	changeCalculator.addCoins({value, amount});
}

function selectSnack(parts) {
	let snackId = parts.join(" ");	// snack ID can be multiple words
	try {
		displayPayResult(dispenser.getSnack(snackId));	
	}
	catch(e) {
		console.warn(e);
	}
}

function pay(parts) {
	let value = parseInt(parts[0]);
	let amount = parseInt(parts[1]);
	try {
		displayPayResult(dispenser.pay({value, amount}));
	}
	catch(e) {
		console.warn(e);
	}
}

function displayPayResult(payResult) {
	if (_.isNumber(payResult)) {
		if (!payResult) return console.log(`your current balance is ${dispenser.balance}`);
		return console.log(`just ${dispenser.currentSnack.price - dispenser.balance} more to pay for that delicious ${dispenser.currentSnack.id}`);
	}
	console.log(`Here is your ${payResult.snackId}, and your change: ${JSON.stringify(payResult.changeDue)}`);
}

function displayStats() {
	console.log(
`Currently paying for ${dispenser.currentSnack? dispenser.currentSnack.id : 'nothing'}. The current balance is ${dispenser.balance}.
The machine contains the following snacks: ${JSON.stringify(repository.snacks)}.
The machine contains the following coins: ${JSON.stringify(changeCalculator.coins)}.`
);
}

function displayUsage() {
	console.log(`usage: 
restock <productId> <price> <numberOfItems>
	adds the given product with the given price and number of items. (shortcut: 'r')
load <coinValue> <numberOfCoins>
	adds the given coins with the given value. (shortcut: 'l')
select <snackId>
	selects the given snack ID to be baught. (shortcut: 's')
pay <coinValue> <numberOfCoins>
	pays in the given number of coins with the given value. (shortcut: 'p')
state
	displays current machine state.
?
	displays this help page.
`);
}