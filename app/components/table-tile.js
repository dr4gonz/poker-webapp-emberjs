import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),
  showGameTile: false,
  model() {
    return this.store.findAll('table');
  },

  actions: {
    joinTable(table) {
      debugger;
      var currentUser = this.get('auth').currentUser;
      currentUser.set('table', table);
      currentUser.set('seat',  table.get('users').toArray().indexOf(currentUser) + 1);
      currentUser.save().then(function(){
        table.save();
      });
      this.set('showGameTile', true);
    },
  }
});
