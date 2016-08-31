import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  mDeck: [],
  community: [],
  winningPlayer: null,
  p1HoleCards: [],
  p2HoleCards: [],
  flop: [],
  turn: null,
  river: null,

  populateDeck(table) {
    this.set('mDeck',[]);
    var suits = ["h", "c", "d", "s"];
    var values = ["2", "3", "4","5","6","7","8","9", "T", "J", "Q","K","A"];
    for (var i = 0; i < suits.length; i++) {
      for (var j = 0; j < values.length; j++) {
        this.get('mDeck').push(values[j]+suits[i]);
      }
    }
    console.log(this.get('mDeck'));
    this.set('mDeck', this.shuffle(this.get('mDeck')));
    this.dealHand(table);
  },
  // Fisher-Yates shuffle method
  shuffle(array) {
    var m = array.length, t, i;
    // While there remain elements to shuffle…
    while (m) {
      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);
      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  },

  dealHand(table) {
    table.set('currentStreet', 'preflop');
    table.set('preflop', true);
    this.assignDealer(table);
    table.save();
    var thisService = this;
    var mDeck = this.get('mDeck');
    var community = [mDeck[0], mDeck[1], mDeck[2], mDeck[3], mDeck[4]];
    this.set('community', community);
    var p1Hand = [mDeck[5], mDeck[6]].concat(community);
    var p2Hand = [mDeck[7], mDeck[8]].concat(community);

    this.get('store').findAll('user').then(function(players) {
      var playerOne = table.get('users').toArray()[0];
      var playerTwo = table.get('users').toArray()[1];
      playerOne.set('cards', p1Hand);
      playerTwo.set('cards', p2Hand);
      playerOne.set('holeCards', [mDeck[5], mDeck[6]]);
      playerTwo.set('holeCards', [mDeck[7], mDeck[8]]);
      playerOne.set('handIsLive', true);
      playerTwo.set('handIsLive', true);
      players.save();
      thisService.findWinners().then(function(winner){
        thisService.set('winningPlayer', winner[0]);
      });
      thisService.set('p1HoleCards',[mDeck[5], mDeck[6]]);
      thisService.set('p2HoleCards',[mDeck[7], mDeck[8]]);
      thisService.set('flop',[mDeck[0], mDeck[1], mDeck[2]]);
      thisService.set('turn',mDeck[3]);
      thisService.set('river',mDeck[4]);
    });
  },
  findWinners() {
    var thisService = this;
    // var community = this.get('community');
    return this.get('store').query('user', {
      orderBy: 'handIsLive',
      equalTo: true
    }).then(function(activePlayers){
      var bestHands = [];
      activePlayers.forEach(function(player) {
        var bestHand = Hand.solve(player.get('cards'));
        // player.set('bestHand', bestHand);
        // player.save();
        bestHands.push(bestHand);
      });
      var winningHands = Hand.winners(bestHands);
      var winningHandArray = [];
      winningHands[0].cardPool.forEach(function(card){
        winningHandArray.push(card.value+card.suit);
      });
      var winningPlayers = [];
      activePlayers.forEach(function(player){
        if (thisService.evaluateHandEquality(player.get('cards'), winningHandArray)) {
          winningPlayers.push(player);
        }
      });
      //do something with winningPlayer
      if (winningPlayers.length === 2) {
        alert ("Tie!");
      }
      console.log(winningPlayers[0]);
      return winningPlayers;
    });
  },

  // function for evaluating equality of 7-card arrays
  evaluateHandEquality(firstHand, secondHand) {
    var returnValue = true;
    firstHand.forEach(function(card) {
      if (!(secondHand.includes(card))) {
        returnValue = false;
      }
    });
    //No non-matching cards were found if we get to this point
    return returnValue;
  },

  dealFlop(table) {
    table.set('flop', true);
    table.save();
  },
  dealTurn(table) {
    table.set('turn', true);
    table.save();
  },
  dealRiver(table) {
    table.set('river', true);
    table.save();
  },
  finishHand(table) {
    table.set('preflop', false);
    table.set('flop', false);
    table.set('turn', false);
    table.set('river', false);
    table.get('users').forEach(function(user) {
      user.set('isActive', false);
      user.save();
    });
    table.save();
  },
  assignDealer(table) {
    var oldActiveUser = table.get('users').toArray()[table.get('activePlayer')];
    oldActiveUser.set('isActive', false);
    oldActiveUser.save();
    table.set('dealer', table.get('dealer') + 1);
    if (table.get('dealer') >= table.get('users').toArray().length) {
      table.set('dealer', 0);
    }
    var activeUser = table.get('users').toArray()[table.get('dealer')];
    activeUser.set('isActive', true);
    activeUser.save();
    table.set('activePlayer', table.get('dealer'));
    table.set('lastToAct', table.get('dealer'));
    table.save();
  },

});
