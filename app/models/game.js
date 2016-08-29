import DS from 'ember-data';

export default DS.Model.extend({
  users: DS.hasMany(),
  // cards: DS.hasMany(),
  deckIndex: DS.attr()
});
