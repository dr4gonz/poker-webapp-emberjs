import Ember from 'ember';

export function amountToCall(params) {
  //params[0]: amountToCall
  //params[1]: current user.currentBet
  if(params[1] > 0){
    return (params[0] - params[1]);
  } else {
    return params[0];
  }
}

export default Ember.Helper.helper(amountToCall);
