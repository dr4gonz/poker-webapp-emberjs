import Ember from 'ember';

export default Ember.Service.extend({
  currentUser: null,
   loggedIn: false,

   logIn(user) {
     this.set('currentUser', user);
     this.set('loggedIn', true);
   },
   logOut() {
     this.set('currentUser', null);
     this.set('loggedIn', false);
   },
});
