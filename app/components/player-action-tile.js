import Ember from 'ember';

export default Ember.Component.extend({
  playerAction: Ember.inject.service(),
  actions: {
    check(table) {
      this.get('playerAction').passActivePlayer(table);
    },
    fold(table) {
      this.get('playerAction').fold(table);
    }
  }
});
