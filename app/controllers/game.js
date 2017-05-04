import Ember from 'ember';

export default Ember.Controller.extend({

  username: '',
  showNameDialog: true,
  bothPlayersArePresent: false,

  actions: {
    joinGame() {
      const game = this.getGameRecord(),
        gameIsStarted = game.isGameStarted();
      debugger;
      if(!gameIsStarted) {
        this.saveGameRecordWithNewPlayer();
      } else {
        //reject
      }
    },
    resetNameDialog() {
      this.clearUsername();
      this.hideNameDialog();
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

  clearUsername() {
    this.set('username', '');
  },

  hideNameDialog() {
    this.set('showNameDialog', false);
  }

});
