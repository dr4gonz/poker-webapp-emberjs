import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  users: DS.hasMany(),
  preflop: DS.attr(),
  flop: DS.attr(),
  turn: DS.attr(),
  river: DS.attr(),
  dealer: DS.attr(),
  activePlayer: DS.attr(),
  lastToAct: DS.attr(),
  currentStreet: DS.attr(),
});
