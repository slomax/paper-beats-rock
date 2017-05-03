import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createNewGame() {
      var newGame = this.store.createRecord('game', {

      });
      newGame.save().then((response) => {
        //redirect to game
      });
    },
    joinGame() {
      console.log('join');
    }
  }
});
