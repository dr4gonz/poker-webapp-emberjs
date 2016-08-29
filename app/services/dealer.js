import Ember from 'ember';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  mDeck: [],
  community: [],

  populateDeck() {
    var deck = [];
    // this.set('mDeck', []);
    var suits = ["h", "c", "d", "s"];
    var values = ["2", "3", "4","5","6","7","8","9", "T", "J", "Q","K","A"];
    for (var i = 0; i < suits.length; i++) {
      for (var j = 0; j < values.length; j++) {
        this.get('mDeck').push(values[j]+suits[i]);
      }
    }
    this.set('mDeck', this.shuffle(this.get('mDeck')));
    deck.forEach((card) => {
      this.get('store').createRecord('card', card).save();
    });
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
  deleteDeck() {
    this.get('store').findAll('card').then(function(cards) {
      cards.forEach(function(card) {
        card.deleteRecord();
        card.get('isDeleted');
        card.save();
      });
    });
  },
  dealHand() {
    var mDeck = this.get('mDeck');
    var community = [mDeck[0], mDeck[1], mDeck[2], mDeck[3], mDeck[4]];
    var store = this.get('store');
    var that = this;
    this.set('community', community);
    var p1Hand = [mDeck[5], mDeck[6]];
    var p2Hand = [mDeck[7], mDeck[8]];
    this.get('store').findAll('user').then(function(players) {
      players.toArray()[0].set('cards', p1Hand);
      players.toArray()[1].set('cards', p2Hand);
      console.log(JSON.parse(JSON.stringify(players.toArray())));
      players.save();
      // var p1BestHand = Hand.solve(p1Hand);
      // var p2BestHand = Hand.solve(p2Hand);
      // var winner = Hand.winners([p1BestHand, p2BestHand]);
      // console.log(p1BestHand, p2BestHand, winner);
      console.log(that.findWinner());

    });
  },
  findWinner() {
    debugger;
    var activePlayers = this.get('store').query('user', {
      orderBy: 'handIsLive',
      equalTo: true
    });

    var bestHands = [];
    activePlayers.forEach(function(player) {
      console.log(player);
      var bestHand = Hand.solve(player.get('cards').concat(this.get('community')));
      player.set('bestHand', bestHand);
      player.save();
      bestHands.push(bestHand);
    });
    var winningHands = Hand.winners(bestHands);
    var winningPlayer = activePlayers.forEach(function(player){
      if (player.get('bestHand') === winningHands[0]) {
        return player;
      }
    });
    //do something with winningPlayer
    return winningPlayer;
  }
});
