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
      var betAmount = parseInt(this.get('betAmount'));
      if (betAmount > 0){
        this.get('playerAction').bet(table, betAmount);
      } else {
        alert('INVALID BET');
        this.set('betAmount', '');
      }
    },
    callBet(table) {
      this.get('playerAction').callBet(table);
    },
    raise(table) {
      var raiseAmount = parseInt(this.get('raiseAmount'));
      var amountToCall = table.get('amountToCall');
      if ((raiseAmount - amountToCall) >= amountToCall) {
        this.get('playerAction').bet(table, raiseAmount);
      } else {
        alert('INVALID BET');
        this.set('raiseAmount', '');
      }
    },
  }
});
