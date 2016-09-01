import Ember from 'ember';


export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    createTable() {
      var thisService = this;
      this.get('store').findAll('table').then(function(tableData){
        tableData.forEach(function(table){
          table.destroyRecord();
        });
          var params = {
            name: thisService.get('name'),
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
            riverCard: null,
            mainPot: null,
            amountToCall: null,
            seatOneOccupied: false,
            seatTwoOccupied: false,
          };
        var newTable = thisService.get('store').createRecord('table', params);
        newTable.save();
      });
    }
  }
});
