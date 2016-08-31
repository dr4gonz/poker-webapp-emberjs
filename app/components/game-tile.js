import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),
  dealer: Ember.inject.service(),


  actions: {
    joinTable(table, seatNumber) {
      var currentUser = this.get('auth').currentUser;
      currentUser.set('table', table);
      currentUser.set('seat',  seatNumber);
      currentUser.save().then(function(){
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
