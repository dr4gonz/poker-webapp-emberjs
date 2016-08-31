import Ember from 'ember';

export default Ember.Component.extend({
  playerAction: Ember.inject.service(),
  actions: {
    check(table) {
      this.get('playerAction').passActivePlayer(table);
    },
    fold(table) {
      this.get('playerAction').fold(table);
    },
    bet(table) {
      this.get('playerAction').bet(table, 5);
    },
    callBet(table) {
      this.get('playerAction').callBet(table);
    },
    raise(table) {
      this.get('playerAction').raise(table, 5);
    },
  }
});
