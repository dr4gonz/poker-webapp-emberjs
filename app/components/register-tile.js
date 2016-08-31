import Ember from 'ember';

export default Ember.Component.extend({
  failedRegister: false,
  failMsg: '',
  store: Ember.inject.service(),
  auth: Ember.inject.service(),

  findMatchingName(desiredUserName, users) {
    var nameMatches = false;
    users.forEach(function(user){
      if (user.get('name') === desiredUserName) {
        nameMatches = true;
      }
    });
    return nameMatches;
  },

  actions: {
    registerUser(users) {
      var desiredUserName = this.get('name');
      var pw = this.get('pw');
      var pwConf = this.get('pwConf');
      // check for empty inputs
      if (desiredUserName === undefined || pw === undefined || pwConf === undefined) {
        this.set('failedRegister', true);
        this.set('failMsg', 'All fields are required');
      // check for matching usernames already in ds
      } else if (this.findMatchingName(desiredUserName, users)) {
        this.set('failedRegister', true);
        this.set('failMsg', 'That username is taken, try another');
        this.set('name', '');
        this.set('pw', '');
        this.set('pwConf', '');
      // check password confirmation
      } else if (pwConf !== pw) {
        this.set('failedRegister', true);
        this.set('failMsg', 'Password fields do not match');
        this.set('pw', '');
        this.set('pwConf', '');
      // success!
      } else {
        var params = {
          name: desiredUserName,
          pw: pw,
          handIsLive: true,
          cards: [],
          holeCards: [],
          table: null,
          seat: null,
        };
        this.set('name', '');
        this.set('pw', '');
        this.set('pwConf', '');
        this.set('failedRegister', false);
        this.set('failMsg', '');
        var newUser = this.get('store').createRecord('user', params);
        newUser.save();
        this.sendAction('hideAllForms');
        this.get('auth').logIn(newUser);
      }
    },
  }
});
