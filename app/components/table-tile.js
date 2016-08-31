import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),
  model() {
    return this.store.findAll('table');
  },

  actions: {
    leaveTable(table) {
      var currentUser = this.get('auth').currentUser;
      currentUser.set('seat', null);
      currentUser.set('table', null);
      currentUser.save().then(function(){
        table.save();
      });
    }
  }
});
