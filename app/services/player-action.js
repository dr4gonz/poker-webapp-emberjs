import Ember from 'ember';

export default Ember.Service.extend({
  passActivePlayer(table) {
    var activePlayerIndex = table.get('activePlayer');

    var currentActiveUser = table.get('users').toArray()[activePlayerIndex];
    currentActiveUser.set('isActive',false);
    currentActiveUser.save();

    activePlayerIndex++;
    if (activePlayerIndex >= table.get('users').toArray().length) {
      activePlayerIndex = 0;
    }

    var nextActiveUser = table.get('users').toArray()[activePlayerIndex];
    nextActiveUser.set('isActive', true);
    nextActiveUser.save();

    table.set('activePlayer', activePlayerIndex);
    table.save();
    this.checkEndStreet(table);
  },
  checkEndStreet(table) {
    var currentStreet = table.get('currentStreet');
    if (table.get('activePlayer') === table.get('lastToAct')) {
      switch (currentStreet) {
        case "preflop":
          table.set('currentStreet', "flop");
          break;
        case "flop":
          table.set('currentStreet', 'turn');
          break;
        case "turn":
          table.set('currentStreet', 'river');
          break;
        case "river":
          table.set('currentStreet', 'finished');
          break;
      }
      var activePlayerIndex = table.get('activePlayer');
      var activePlayer = table.get('users').toArray()[activePlayerIndex];
      activePlayer.set('isActive', false);
      activePlayer.save();

      activePlayerIndex = table.get('dealer') + 1;
      if (activePlayerIndex >= table.get('users').toArray().length) {
        activePlayerIndex = 0;
      }

      table.set('activePlayer', activePlayerIndex);
      table.set('lastToAct', activePlayerIndex);
      var newActivePlayer = table.get('users').toArray()[activePlayerIndex];

      newActivePlayer.set('isActive', true);
      newActivePlayer.save();
      table.save();

      return true; //true signifies that action is done for this street
    } else {
      return false; //false signifies that next player can act
    }
  }
});
