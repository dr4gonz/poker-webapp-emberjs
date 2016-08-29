import Ember from 'ember';

export default Ember.Component.extend({
  dealer: Ember.inject.service(),
  auth: Ember.inject.service(),

  actions: {
    populateDeck() {
      this.get('dealer').deleteDeck();
      this.get('dealer').populateDeck();
    },
    deleteDeck() {
      this.get('dealer').deleteDeck();
    },
    drawCard(deck, game) {
      console.log(game);
      var user = this.get('auth').currentUser;
      var hand = [];
      // while (hand.length < 2)
      var card1 = deck.toArray()[game.get('deckIndex')];
      console.log(game.get('deckIndex'));
      game.set('deckIndex', game.get('deckIndex')+1);
      hand.push(card1);
      user.set('cards', hand);
      user.save();
    }
  }
});
