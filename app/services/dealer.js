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

  populateDeck() {
    var suits = ["h", "c", "d", "s"];
    var values = ["2", "3", "4","5","6","7","8","9", "T", "J", "Q","K","A"];
    for (var i = 0; i < suits.length; i++) {
      for (var j = 0; j < values.length; j++) {
        this.get('mDeck').push(values[j]+suits[i]);
      }
    }
    this.set('mDeck', this.shuffle(this.get('mDeck')));
    this.dealHand();
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

  dealHand() {
    var thisService = this;
    var mDeck = this.get('mDeck');
    var community = [mDeck[0], mDeck[1], mDeck[2], mDeck[3], mDeck[4]];
    this.set('community', community);
    var p1Hand = [mDeck[5], mDeck[6]].concat(community);
    var p2Hand = [mDeck[7], mDeck[8]].concat(community);
    this.get('store').findAll('user').then(function(players) {
      players.toArray()[0].set('cards', p1Hand);
      players.toArray()[1].set('cards', p2Hand);
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
    //
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
  }
});