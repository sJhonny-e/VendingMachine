'use strict'
let _ = require('lodash')

class ChangeCalculator {
	constructor(initialObj) {
		this.coins = initialObj;
	}

	getChange(requiredChage) {
		// TODO: change this to something a little more sophisticated...
		let change = [];	
		let coinsCopy = _.cloneDeep(this.coins);	// working on a copy of the actual coins collection

		while(requiredChage > 0) {
			// go over available coins, from largest to smallest
			let highestDenominationCoin = _.chain(coinsCopy)
				.orderBy(['value'], ['desc'])
				.find((coin) => coin.amount > 0 && coin.value <= requiredChage)
				.value();

			if (!highestDenominationCoin)
				return null;	// can't find any coins
			
			let numberOfCoins = Math.min(highestDenominationCoin.amount, Math.floor(requiredChage / highestDenominationCoin.value));

			highestDenominationCoin.amount -= numberOfCoins;
			requiredChage -= numberOfCoins * highestDenominationCoin.value;

			change.push({ value: highestDenominationCoin.value, amount: numberOfCoins });
		}

		// change was found; persist the coins to be returned to the actual coin storage
		// TODO: refactor this out of here into a repository or something
		change.forEach((changeCoin) => {
			let coin = _.find(this.coins, {'value' : changeCoin.value});
			coin.amount -= changeCoin.amount;
		});

		return change;
	}

	// TODO: refactor this out of here into a repository or something
	addCoins(additionalCoins) {
		let coin = _.find(this.coins, {'value' : additionalCoins.value});
		// TODO: error checking
		coin.amount += additionalCoins.amount;
	}
}

module.exports = ChangeCalculator;