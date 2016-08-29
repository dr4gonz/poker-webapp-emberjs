import Ember from 'ember';

export default Ember.Component.extend({
  failedLogin: false,
  failMsg: '',
  auth: Ember.inject.service(),

  findUser(name, users) {
    var userInDb = false;
    users.forEach(function(user) {
      if (user.get('name') === name) {
        userInDb = user;
      }
    });
    return userInDb;
  },

  actions: {
    logIn(users) {
      var userInDb;
      //ensure all fields have input
      if ((this.get('name') === undefined) || (this.get('pw') === undefined)) {
        this.set('failedLogin', true);
        this.set('failMsg', 'All fields are required');
      } else {
        // find corresponding username in ds
        userInDb = this.findUser(this.get('name'), users);
        if (!userInDb) {
          this.set('failedLogin', true);
          this.set('failMsg', 'Username not found.');
        // check passwords
        } else if (userInDb.get('pw') !== this.get('pw')){
          this.set('failedLogin', true);
          this.set('failMsg', 'Incorrect password');
          this.set('pw', '');
        } else {
          //success!
          this.get('auth').logIn(userInDb);
          this.set('failedLogin', false);
          this.set('failMsg', '');
          this.set('name', '');
          this.set('pw', '');
          this.sendAction('hideAllForms');
        }
      }
    }
  }
});
