import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),
  dealer: Ember.inject.service(),


  actions: {
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
