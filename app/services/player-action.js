import Ember from 'ember';

export default Ember.Service.extend({
  dealer: Ember.inject.service(),

  passActivePlayer(table) {
    var activePlayerIndex = table.get('activePlayer');

    var currentActiveUser = table.get('users').toArray()[activePlayerIndex];
    currentActiveUser.set('isActive',false);
    currentActiveUser.save();

    var nextActiveUser;
    do {
      activePlayerIndex++;
      if (activePlayerIndex >= table.get('users').toArray().length) {
        activePlayerIndex = 0;
      }
      nextActiveUser = table.get('users').toArray()[activePlayerIndex];
    } while (!nextActiveUser.get('handIsLive'));

    console.log('setting '+nextActiveUser.get('name')+' to active...');
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
      table.set('amountToCall', 0);
      table.save();

      return true; //true signifies that action is done for this street
    } else {
      return false; //false signifies that next player can act
    }
  },
  fold(table) {
    var activePlayer = table.get('users').toArray()[table.get('activePlayer')];
    activePlayer.set('handIsLive', false);
    activePlayer.save();

    if (this.checkLiveHands(table)) {
      this.passActivePlayer(table);
    }
  },
  checkLiveHands(table) {
    var liveHandCount = 0;
    var lastLivePlayer;
    table.get('users').toArray().forEach((player) => {
      if (player.get('handIsLive')) {
        lastLivePlayer = player;
        liveHandCount++;
      }
    });
    if (liveHandCount === 1) {
      this.get('dealer').finishHand(table);
      this.get('dealer').populateDeck(table);
      console.log(lastLivePlayer.get('name') +" won the hand");
      return false;
    } else {
      return true;
    }
  },
  bet(table, betAmount) {
    var mainPot = table.get('mainPot');

    table.set('mainPot', mainPot + betAmount);
    table.set('amountToCall', betAmount);
    table.save();

    this.passActivePlayer(table);
  },
  callBet(table) {
    var mainPot = table.get('mainPot');
    var amountToCall = table.get('amountToCall');

    table.set('mainPot', mainPot + amountToCall);
    table.save();

    this.passActivePlayer(table);
  }
});
