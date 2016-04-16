'use strict'

let chai = require('chai');
let expect = chai.expect;

let sinon = require('sinon');

let Dispenser = require('../lib/dispenser');

describe('Dispenser', function() {
	let repository;
	let changeCalculator;
	let dispenser;
	let snack = {id: 'junior mint', numItems: 3, price: 20};

	beforeEach(function() {
		repository = { get: function() {} };
		changeCalculator = { getChange: function() {} };

		repository = sinon.mock(repository);
		changeCalculator = sinon.mock(changeCalculator);

		dispenser = new Dispenser(repository.object, changeCalculator.object);
	});

	describe('#getSnack', function() {
		it('should throw when snack not found', function() {
			repository.expects('get').withExactArgs('snapple').returns(undefined);

			expect(() => dispenser.getSnack('snapple')).to.throw('snapple is out of stock!');
			repository.verify();
		});


		it('should throw if no change can be given', function() {
			repository.expects('get').returns(snack);
			changeCalculator.expects('getChange').returns(null);

			expect(() => dispenser.getSnack('junior mint')).to.throw('sorry, no change can be given right now');

		});
	});

	describe('#pay', function() {
		it('should just increase the balance if no snack was chosen yet', function() {
			let result = dispenser.pay(10);

			expect(result).to.eql(0);	// 0 left to pay, since no snack was chosen
			expect(dispenser.balance).to.eql(10);
		});

		it('should return the remaining amount if not enough has been payed yet', function() {
			dispenser.balance = 5;
			dispenser.currentSnack = snack;

			expect(dispenser.pay(10)).to.eql(5);	// 5 remaining to be paid
			expect(dispenser.balance).to.eql(15);
		});

		it('dispenses and returns change if correct amount was paid', function() {
			dispenser.currentSnack = snack;
			
			let changeObj = [{ value: 1, amount : 4 }, { value: 20, amount: 6 }];
			changeCalculator.expects('getChange').withExactArgs(5).returns(changeObj);

			let result = dispenser.pay(25);

			expect(dispenser.balance).to.eql(0);
			expect(snack.numItems).to.eql(2);
			expect(result).to.eql({snackId: 'junior mint', changeDue: changeObj });

			changeCalculator.verify();
		});
	});
});