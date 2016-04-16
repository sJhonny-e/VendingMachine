'use strict'

let chai = require('chai');
let expect = chai.expect;

let sinon = require('sinon');

let SnacksRepository = require('../lib/snacksRepository');

describe('SnacksRepository', function() {
	let repositry;
	let drakes = {id: 'drakes coffee cakes', price: 4, numItems: 3};
	let joojiFruits = {id: 'jooji fruits', price: 8, numItems: 23}

	let initialItems = { [drakes.id] : drakes, [joojiFruits.id] : joojiFruits };

	beforeEach(function(){
		repositry = new SnacksRepository(initialItems);
	});

	describe('#get', function() {
		it('should return the item if exists', function() {
			expect(repositry.get('jooji fruits')).to.eql(joojiFruits);
		});

		it('should return nothing if item doesnt exist', function() {
			expect(repositry.get('bosco')).to.not.be.ok;
		})
	});

	describe('#add', function() {
		it('should add a new type of snack', function() {
			let snack = {id: 'oh henry', price: 7};
			repositry.add(snack, 50);

			expect(repositry.get('oh henry')).to.eql({id: 'oh henry', price: 7, numItems: 50});
		});

		it('should add the number of items for an existing type of snack', function() {
			repositry.add(drakes, 45);
			expect(repositry.get('drakes coffee cakes')).to.have.property('numItems', 48);
		});
	});
});