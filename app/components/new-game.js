import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    createGame() {
      var params = {
        deckIndex: 0,
      };
      this.get('store').createRecord('game', params).save();
    }
  }
});
