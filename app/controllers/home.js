import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createNewGame() {
      var newGame = this.store.createRecord('game', {
        playerOneName: 'Sean'
      });
      newGame.save().then((response) => {
        this.transitionToRoute('game', response.get('id'));
      });
    },
    joinGame() {
      console.log('join');
    }
  }
});
