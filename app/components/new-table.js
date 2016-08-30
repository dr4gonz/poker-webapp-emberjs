import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    createTable() {
      var params = {
        name: this.get('name'),
        users: [],
      };
      var newTable = this.get('store').createRecord('table', params);
      newTable.save();
    }
  }
});
