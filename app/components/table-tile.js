import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),
  actions: {
    joinTable(table) {
      var currentUser = this.get('auth').currentUser;
      currentUser.set('table', table);
      currentUser.save().then(function(){
        table.save();
      });
      this.sendAction('joinTable');
    },
  }
});
