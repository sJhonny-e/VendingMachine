# VendingMachine
A little command line program that simulates a vending machine.  
"Admin" User can stock the machine with snacks, and load coins into it.  
A user can pay coins into the machine, and select a product.  
Once the user has enough balance for the selected product, it's dispensed from the machine, and the user receives their change.  

##Install
Prerequisites: node + npm  
run `npm install`
##Tests
run `npm test`
##Run
run `npm run`  
type in the `?` command to see how to use the command-line interface.

#About
The main logic is the `Dispenser` object, which holds the current state of chosen snack and balance, receives snack choices and payments, and dispenses a snack when balance is sufficient.  
It uses the `SnacksRepository` to check and update availability of snacks, and `ChangeCalculator` to return the correct change.  
If a change cannot be given, an error occurs.  

I feel that this is a nice and decoupled design, which allows for different parts (for example - the way change is calculated) to be modified independently.
##Things to improve
Obviously this is just a little program whipped up in a few hours. There are quite a few things that can be improved:
* The algorithm for change calculation, which is very dumb.
* The design of `ChangeCalculaor` should be different; it should be split between data storage and change logic. A new `CoinsRepository` should be introduced to handle adding and removing coins.
* It's possibel to make `Dispenser` a little more single-responsible by separating `_dispenseIfPossible` to a method that handles dispensing, and another method which handles returning the remaining amount to pay / change.
* Return value from `Dispenser.pay` can be either a number, indicating the amount due, or an object, indicating the change given. This is a bit inconsistent.
* In a 'real world' scenario, the repositories would be asynchronous, so we'd need to make the using code asynch as well.
* It would be nice to allow restocking snacks and loading coins from files.
* Better output formatting would be nice.
