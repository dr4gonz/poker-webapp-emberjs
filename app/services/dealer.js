import Ember from 'ember';
import Firebase from 'firebase';

export default Ember.Service.extend({
  store: Ember.inject.service(),

  populateDeck() {
    var deck = [];
    var suits = ["h", "c", "d", "s"];
    var values = ["2", "3", "4","5","6","7","8","9", "T", "J", "Q","K","A"];
    for (var i = 0; i < suits.length; i++) {
      for (var j = 0; j < values.length; j++) {
        var params = {
          suit: suits[i],
          value: values[j]
        };
        deck.push(params);
      }
    }
    deck = this.shuffle(deck);
    deck.forEach((card) => {
      this.get('store').createRecord('card', card).save();
    });
  },
  popCard() {
    //remove a card from the array and return it
    //save deck to firebase

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
      })
    });
  }


});
