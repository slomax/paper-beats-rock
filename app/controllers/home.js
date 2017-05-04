import Ember from 'ember';

const NEW_GAME_CONFIG = {
  playerOneName: 'sean',
  playerTwoName: '',
  playerOneWins: 0,
  playerTwoWins: 0,
  playerOneChoice: '',
  playerTwoChoice: '',
  timer: 0,
  gameHasStarted: false
}

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
      this.retrieveGameRecordById(gameId).then((game) => {
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
    return this.store.createRecord('game', NEW_GAME_CONFIG);
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
