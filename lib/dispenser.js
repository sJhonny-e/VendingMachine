'use strict'

class Dispenser {
	constructor(snacksRepository, changeCalculator) {
		this.snacksRepository = snacksRepository;
		this.changeCalculator = changeCalculator;
		this.balance = 0;
		this.currentSnack = null;
	}

	getSnack(snackId) {
		this.currentSnack = this.snacksRepository.get(snackId);
		if (!this.currentSnack || !this.currentSnack.numItems)
			throw snackId + ' is out of stock!';
		
		return this._getAmountToBePaid();
	}

	pay(coinsObj) {
		this.balance += coinsObj.amount * coinsObj.value;
		if (!this.currentSnack) 
			return 0;	// no snack was chosen yet, nothing to dispense

		return this._getAmountToBePaid();
	}

	_getAmountToBePaid () {
		if (this.balance < this.currentSnack.price) 
			return this.currentSnack.price - this.balance;	//return amount due to be payed

		// We've finished paying; product should be dispensed
		var changeDue = this.changeCalculator.getChange(this.balance - this.currentSnack.price);
		if (!changeDue)
			throw 'sorry, no change can be given right now';	// TODO: something more informative, like what other coins can be inserted to make this work
		
		// dispense the drink
		let snackId = this.currentSnack.id;
		this.currentSnack.numItems--;
		this.currentSnack = null;
		this.balance = 0;

		return { snackId, changeDue };
	}

}

module.exports = Dispenser;