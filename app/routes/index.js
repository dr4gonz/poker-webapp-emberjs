import Ember from 'ember';

export default Ember.Route.extend({
  showGameTile: false,

  model() {
    return Ember.RSVP.hash({
      users: this.store.findAll('user'),
      tables: this.store.findAll('table')
    });
  },

});
