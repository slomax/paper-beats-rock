import Ember from 'ember';

export default Ember.Controller.extend({

  clearName() {
    this.set('name', '');
  },

  hideNameDialog() {
    this.set('model.showNameDialog', false);
  },

  actions: {
    createNewGame() {
      const newGame = this.store.createRecord('game', {
        playerOneName: this.get('name')
      });
      newGame.save().then((response) => {
        this.send('resetDialog');
        this.transitionToRoute('game', response.get('id'));
      });
    },
    joinGame() {
      this.store.find('game', this.get('model.gameId')).then((game) => {
        game.set('playerTwoName', this.get('name'));
        game.save().then((response) => {
          this.send('resetDialog');
          this.transitionToRoute('game', response.get('id'));
        });
      });
    },
    showNameDialog() {
      this.set('model.showNameDialog', true);
    },
    resetDialog() {
      this.clearName();
      this.hideNameDialog();
    }
  }
});
