import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('player-action-tile', 'Integration | Component | player action tile', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{player-action-tile}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#player-action-tile}}
      template block text
    {{/player-action-tile}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
