import Ember from 'ember';

export default Ember.Route.extend({
  joinedTable: false,

  model() {
    return Ember.RSVP.hash({
      users: this.store.findAll('user'),
      tables: this.store.findAll('table')
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
