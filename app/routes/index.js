import Ember from 'ember';

export default Ember.Route.extend({
  dealer: Ember.inject.service(),
  model() {
    return Ember.RSVP.hash({
      users: this.store.findAll('user'),
      cards: this.store.findAll('card'),
      game: this.store.findAll('game'),
    });
  },



});
