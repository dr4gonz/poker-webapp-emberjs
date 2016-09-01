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

    nextActiveUser.set('isActive', true);
    nextActiveUser.save();

    table.set('activePlayer', activePlayerIndex);
    table.save();
    this.checkEndStreet(table);
  },

  checkEndStreet(table) {
    var thisService = this;
    var currentStreet = table.get('currentStreet');
    var users = table.get('users').toArray();
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
          thisService.get('dealer').findWinners(table);
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
      users.forEach((user) => {
        user.set('currentBet', 0);
        user.save();
      });
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
      this.get('dealer').awardPot(table, lastLivePlayer);
      this.get('dealer').populateDeck(table);
      return false;
    } else {
      return true;
    }
  },
  bet(table, betAmount) {
    var mainPot = table.get('mainPot');
    var activeUser = table.get('users').toArray()[table.get('activePlayer')];
    if (betAmount > activeUser.get('chips')){
      alert('INVALID BET');
    } else {

      activeUser.set('chips', (activeUser.get('chips')-betAmount));
      activeUser.set('currentBet', betAmount);
      activeUser.save();

      table.set('mainPot', mainPot + betAmount);
      table.set('amountToCall', betAmount);
      table.set('lastToAct', table.get('activePlayer'));
      table.save();

      this.passActivePlayer(table);
    }
  },
  callBet(table) {
    var mainPot = table.get('mainPot');
    var amountToCall = table.get('amountToCall');
    var activeUser = table.get('users').toArray()[table.get('activePlayer')];

    table.set('mainPot', (mainPot + (amountToCall - activeUser.get('currentBet'))));
    activeUser.set('chips', (activeUser.get('chips')-(amountToCall - activeUser.get('currentBet'))));
    //provides a check to see if this call puts user all-in. Returns un-called chips.
    if (activeUser.get('chips') <= 0) {
      var uncalledChips = (activeUser.get('chips') * -1);
      var bettingPlayer = table.get('users').toArray()[table.get('lastToAct')];
      bettingPlayer.set('chips', bettingPlayer.get('chips') + (uncalledChips));
      table.set('mainPot', (table.get('mainPot') - uncalledChips * 2));
      activeUser.set('chips', 0);
      bettingPlayer.save();
    }
    activeUser.set('currentBet', amountToCall);
    table.save();

    this.passActivePlayer(table);
  },
  raise(table, raiseAmount) {
    var mainPot = table.get('mainPot');
    var activeUser = table.get('users').toArray()[table.get('activePlayer')];
    if (raiseAmount > activeUser.get('chips')) {
      alert('INVALID BET');
    } else {
      activeUser.set('chips', (activeUser.get('chips')-(raiseAmount - activeUser.get('currentBet'))));
      activeUser.set('currentBet', raiseAmount);

      var amountToCall = table.get('amountToCall');
      table.set('mainPot', mainPot+raiseAmount);
      table.set('amountToCall', amountToCall+raiseAmount);
      table.set('lastToAct', table.get('activePlayer'));
      table.save();

      this.passActivePlayer(table);
    }
  },
});
