import DS from 'ember-data';

export default DS.Model.extend({
  suit: DS.attr(),
  value: DS.attr()
});
