import Ember from 'ember';

export default Ember.Controller.extend({

  username: '',
  showNameDialog: true,
  bothPlayersArePresent: false,

  actions: {
    joinGame() {
      this.saveGameRecordWithNewPlayer();
      this.saveGameRecordWithNewStatus();
      this.resetNameDialog();
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

  saveGameRecordWithNewStatus() {
    const game = this.getGameRecord(),
          playerOneName = game.getPlayerOneName(),
          playerTwoName = game.getPlayerTwoName(),
          gameShouldStart = playerOneName.length > 0 && playerTwoName.length > 0;
    game.setGameHasStarted(gameShouldStart);
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
