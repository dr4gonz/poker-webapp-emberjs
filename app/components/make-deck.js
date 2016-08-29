import Ember from 'ember';

export default Ember.Component.extend({
  dealer: Ember.inject.service(),

  actions: {
    populateDeck() {
      this.get('dealer').deleteDeck();
      this.get('dealer').populateDeck();
    },
    deleteDeck() {
      this.get('dealer').deleteDeck();
    }
  }
});
