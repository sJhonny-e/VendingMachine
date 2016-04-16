'use strict'

let chai = require('chai');
let expect = chai.expect;

let sinon = require('sinon');

let ChangeCalculator = require('../lib/changeCalculator');

describe('ChangeCalculator', function() {
	let coins;
	let calculator;
	beforeEach(function(){
		// values are in p (i.e 100 -> $1)
		coins = [
			{ value: 1, amount: 2 },
			{ value: 2, amount: 3 },
			{ value: 20, amount: 1 },
			{ value: 50, amount: 4 },
			{ value: 100, amount: 2 },
		];
		calculator = new ChangeCalculator(coins);
	})

	describe('#getChange', function() {
		it('should return nothing if amount is too high', function() {
			expect(calculator.getChange(2800)).to.not.be.ok;
		});

		it('should return an empty object if no change is required', function() {
			expect(calculator.getChange(0)).to.eql([]);
		});

		it('should return exactly 1 coin if thats the change needed', function() {
			expect(calculator.getChange(2)).to.eql([{value: 2, amount: 1}]);
		});

		it('should return 3 * 2p and 2 * 1p for 8p change', function() {
			expect(calculator.getChange(8)).to.eql([
				{value: 2, amount: 3},
				{value: 1, amount: 2},
				]);
		});

		it('should return 1 * 100p, 1 * 50p, 1 * 20p, 2 * 2p, 1 * 1p for 175p change', function() {
			expect(calculator.getChange(175)).to.eql([
				{value: 100, amount: 1},
				{value: 50, amount: 1},
				{value: 20, amount: 1},
				{value: 2, amount: 2},
				{value: 1, amount: 1},
				]);
		});

	});
})