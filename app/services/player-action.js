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
  }
});
