import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createNewGame() {
      console.log('create new');
    },
    joinGame() {
      console.log('join');
    }
  }
});
