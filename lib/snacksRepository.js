'use strict'

class SnacksRepository {
	constructor(initialObj) {
		this.snacks = initialObj;
	}

	get(snackId) {
		return this.snacks[snackId];
	}

	add(snack, numItems) {
		if (!this.snacks[snack.id]) {
			this.snacks[snack.id] = snack;
			this.snacks[snack.id].numItems = 0;
		}
		// NOTE: only the number of items for the snack is updated; this means that you can't update the price of an existing snack!
		this.snacks[snack.id].numItems += numItems;
	}
}

module.exports = SnacksRepository;