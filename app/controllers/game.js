import Ember from 'ember';

export default Ember.Controller.extend({

  username: '',
  showNameDialog: true,
  bothPlayersArePresent: false,

  actions: {
    joinGame() {
      const game = this.getGameRecord(),
        gameIsStarted = game.isGameStarted();
      if(!gameIsStarted) {
        this.saveGameRecordWithNewPlayer();
        this.resetNameDialog();
      } else {
        //reject
      }
    },
    closeDialog() {
      this.resetNameDialog();
    }
  },

  saveGameRecordWithNewPlayer() {
    const game = this.getGameRecord(),
          newPlayerName = this.get('username');
    if(this.gameHasFirstPlayer()) {
      game.setPlayerTwoName(newPlayerName);
      game.setGameHasStarted(true);
    } else {
      game.setPlayerOneName(newPlayerName);
    }
    game.save();
  },

  gameHasFirstPlayer() {
    const game = this.getGameRecord();
    return game.getPlayerOneName().length > 0;
  },

  getGameRecord() {
    return this.get('model');
  },

  resetNameDialog() {
    this.clearUsername();
    this.hideNameDialog();
  },

  clearUsername() {
    this.set('username', '');
  },

  hideNameDialog() {
    this.set('showNameDialog', false);
  }

});
