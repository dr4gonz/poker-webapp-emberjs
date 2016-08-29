import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr(),
  pw: DS.attr(),
  cards: DS.hasMany(),

});
