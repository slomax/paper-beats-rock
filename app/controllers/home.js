import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {

    createNewGame() {
      const newGameRecord = this.createNewGameRecord();
      newGameRecord.save().then((game) => {
        this.redirectToGame(game)
      });
    },

    joinGame() {
      const gameId = this.get('gameId');
      this.retrieveGameRecordById().then((game) => {
        this.redirectToGame(game);
      });
    },

    showGameIdDialog() {
      this.set('showGameIdDialog', true);
    },

    resetDialog() {
      this.clearGameId();
      this.hideGameIdDialog();
    }
  },

  createNewGameRecord() {
    return this.store.createRecord('game');
  },

  redirectToGame(game) {
    this.transitionToRoute('game', game.get('id'))
  },

  retrieveGameRecordById(gameId) {
    return this.store.find('game', gameId);
  },

  clearGameId() {
    this.set('gameId', '');
  },

  hideGameIdDialog() {
    this.set('showGameIdDialog', false);
  }
});
