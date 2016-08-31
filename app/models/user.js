import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  pw: DS.attr(),
  cards: DS.attr(),
  holeCards: DS.attr(),
  handIsLive: DS.attr(),
  table: DS.belongsTo(),
  isActive: DS.attr(),
  seat: DS.attr(),
  currentBet: DS.attr(),
});
