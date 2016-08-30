import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),
  dealer: Ember.inject.service(),
  preflop: false,
  flop: false,
  turn: false,
  river: false,
  

  actions: {
    dealHand(table) {
      this.get('dealer').populateDeck(table);
      this.set('preflop', true);

    },
    dealFlop() {
      this.set('flop', true);
    },
    dealTurn() {
      this.set('turn', true);
    },
    dealRiver() {
      this.set('river', true);
    },
    finishHand() {
      this.set('preflop', false);
      this.set('flop', false);
      this.set('turn', false);
      this.set('river', false);
    }

  }

});
