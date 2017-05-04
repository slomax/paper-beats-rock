import Ember from 'ember';

export default Ember.Controller.extend({

  username: '',
  showNameDialog: true,
  bothPlayersArePresent: false,

  actions: {
    joinGame() {
      const game = this.getGameRecord(),
            gameHasStarted = game.get('gameHasStarted');
      debugger;
      if(!gameHasStarted) {
        this.saveGameRecordWithNewPlayer();
      } else {
        //reject
      }
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

  hideNameDialog() {
    this.set('showNameDialog', false);
  }

});
