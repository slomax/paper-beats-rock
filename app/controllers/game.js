import Ember from 'ember';

export default Ember.Controller.extend({

  usernameTextFieldValue: '',
  showNameDialog: true,
  currentPlayerName: '',
  inputsDisabled: true,

  actions: {
    joinGame() {
      this.saveGameRecordWithNewPlayer();
      this.saveGameRecordWithNewStatus();
      this.saveUserNameTextAsCurrentPlayerName();
      this.resetNameDialog();
    },
    closeDialog() {
      this.resetNameDialog();
    }
  },

  saveGameRecordWithNewPlayer() {
    const game = this.getGameRecord(),
          newPlayerName = this.get('usernameTextFieldValue');
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
          gameShouldStart = game.bothPlayersExist();
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

  saveUserNameTextAsCurrentPlayerName() {
    const usernameTextFieldValue = this.get('usernameTextFieldValue');
    this.set('currentPlayerName', usernameTextFieldValue);
  },

  resetNameDialog() {
    this.clearUsernameTextFieldValue();
    this.hideNameDialog();
  },

  clearUsernameTextFieldValue() {
    this.set('usernameTextFieldValue', '');
  },

  hideNameDialog() {
    this.set('showNameDialog', false);
  }

});
