import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),
  playerAction: Ember.inject.service(),

  actions: {
    leaveTable(table) {
      var thisService = this;
      var currentUser = this.get('auth').currentUser;
      var seatNumber = currentUser.get('seat');
      currentUser.set('seat', null);
      currentUser.set('table', null);
      currentUser.save().then(function(){
        switch (seatNumber) {
          case 1:
            table.set('seatOneOccupied', false);
            break;
          case 2:
            table.set('seatTwoOccupied', false);
            break;
          default:
            console.log("somebody tried to leave a table without a seat number");
            break;
        }
        table.save();
        thisService.get('playerAction').leaveTable(table, currentUser);
      });
    }
  }
});
