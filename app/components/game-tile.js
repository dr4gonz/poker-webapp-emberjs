import Ember from 'ember';

export default Ember.Component.extend({
  model() {
    return this.get('store').findAll('user');
  },
  auth: Ember.inject.service(),
  dealer: Ember.inject.service(),
  store: Ember.inject.service(),

  actions: {
    joinTable(table, seatNumber) {
      var thisService = this;
      var currentUser = this.get('auth').currentUser;
      currentUser.set('table', table);
      currentUser.set('seat',  seatNumber);
      currentUser.save().then(function(){
        switch (seatNumber) {
          case 1:
            table.set('seatOneOccupied', true);
            break;
          case 2:
            table.set('seatTwoOccupied', true);
            break;
          default:
            console.log("somebody tried to join a table without a seat number");
            break;
        }
        thisService.get('dealer').finishHand(table);
        table.save();
      });
    },
    dealHand(table) {
      this.get('dealer').populateDeck(table);
    },
    dealFlop(table) {
      this.get('dealer').dealFlop(table);
    },
    dealTurn(table) {
      this.get('dealer').dealTurn(table);
    },
    dealRiver(table) {
      this.get('dealer').dealRiver(table);
    },
    finishHand(table) {
      this.get('dealer').finishHand(table);
    }

  }

});
