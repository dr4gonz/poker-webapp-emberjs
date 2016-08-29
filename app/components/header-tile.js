import Ember from 'ember';

export default Ember.Component.extend({
  loginForm: false,
  registerForm: false,
  auth: Ember.inject.service(),

  actions: {
    showLoginForm() {
      this.set('registerForm', false);
      this.set('loginForm', true);
    },
    showRegisterForm() {
      this.set('registerForm', true);
      this.set('loginForm', false);
    },
    hideAllForms() {
      this.set('registerForm', false);
      this.set('loginForm', false);
    },
    logOut() {
      this.get('auth').logOut();
      this.set('registerForm', false);
      this.set('loginForm', false);
    },
  }

});
