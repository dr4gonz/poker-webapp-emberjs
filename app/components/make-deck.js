import Ember from 'ember';

export default Ember.Component.extend({
  dealer: Ember.inject.service(),
  auth: Ember.inject.service(),

  actions: {
    populateDeck() {
      this.get('dealer').deleteDeck();
      this.get('dealer').populateDeck();
    },

  }
});
