import Ember from 'ember';

export default Ember.Route.extend({
<<<<<<< HEAD
  dealer: Ember.inject.service(),
  model() {
    return Ember.RSVP.hash({
      users: this.store.findAll('user'),
      cards: this.store.findAll('card'),
      game: this.store.findAll('game'),
=======
  joinedTable: false,

  model() {
    return Ember.RSVP.hash({
      users: this.store.findAll('user'),
      tables: this.store.findAll('table')
>>>>>>> master
    });
  },

  actions: {
    joinTable() {
      this.set('joinedTable', true);
      console.log("joining table.........");
      console.log(this.get("joinedTable"));
    }
  },

});
