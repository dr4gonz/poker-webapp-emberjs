import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    createTable() {
      var params = {
        name: this.get('name') ? name: "New Table",
        users: [],
        preflop: false,
        flop: false,
        turn: false,
        river: false,
        dealer: 0,
        activePlayer: 0,
        lastToAct: null,
        currentStreet: null,
        flopCards: [],
        turnCard: null,
        riverCard: null
      };
      var newTable = this.get('store').createRecord('table', params);
      newTable.save();
    }
  }
});
