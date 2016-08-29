import Ember from 'ember';
var Hand = require('pokersolve').Hand;
// import Hand from 'pokersolver';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  mDeck: [],

  populateDeck() {
    var deck = [];
    // this.set('mDeck', []);
    var suits = ["h", "c", "d", "s"];
    var values = ["2", "3", "4","5","6","7","8","9", "T", "J", "Q","K","A"];
    for (var i = 0; i < suits.length; i++) {
      for (var j = 0; j < values.length; j++) {
        var params = {
          suit: suits[i],
          value: values[j]
        };
        deck.push(params);
        this.get('mDeck').push(values[j]+suits[i]);
      }
    }
    deck = this.shuffle(deck);
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
    var flop = [community[0], community[1], community[2]];
    var turn = community[3];
    var river = community[4];
    var p1Hand = [mDeck[5], mDeck[6]].concat(community);
    var p2Hand = [mDeck[7], mDeck[8]].concat(community);
    var p1BestHand = Hand.solve(p1Hand);
    var p2BestHand = Hand.solve(p2Hand);
    var winner = Hand.winners([p1BestHand, p2BestHand]);
    console.log(p1BestHand, p2BestHand, winner);
  }


});
