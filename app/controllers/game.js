import Ember from 'ember';

const AWAITING_INPUT = 'Enter your choice!'
const ROCK = "ROCK";
const PAPER = "PAPER";
const SCISSORS = "SCISSORS";

export default Ember.Controller.extend({

  usernameTextFieldValue: '',
  showNameDialog: true,
  currentPlayerName: '',
  inputsDisabled: true,
  playerOneMessage: '',
  playerTwoMessage: '',
  playerOneIsActive: false,

  actions: {
    joinGame() {
      this.saveGameRecordWithNewPlayer();
      this.saveGameRecordWithNewStatus();
      this.saveUserNameTextAsCurrentPlayerName();
      this.determineIfPlayerOneIsActive();
      this.resetNameDialog();

      const game = this.getGameRecord();
      if(game.isGameStarted()) {
        this.startGame();
      }
    },
    closeDialog() {
      this.resetNameDialog();
    },
    handleRockClick() {
      this.handleChoice(ROCK);
    },
    handlePaperClick() {
      this.handleChoice(PAPER);
    },
    handleScissorsClick() {
      this.handleChoice(SCISSORS);
    }
  },

  handleChoice(choice) {
    const game = this.getGameRecord();
    this.saveActivePlayerMessage(choice);
    this.saveActivePlayerChoice(choice);
    //start timer and handle timeout
  },

  saveActivePlayerChoice(choice) {
    const game = this.getGameRecord();
    if(this.getPlayerOneIsActive()) {
      game.setPlayerOneChoice(choice);
    } else {
      game.setPlayerTwoChoice(choice);
    }
    game.save();
  },

  determineIfPlayerOneIsActive() {
    const game = this.getGameRecord(),
          currentPlayerName = this.getCurrentPlayerName(),
          playerOneName = game.getPlayerOneName(),
          playerOneIsActive = (currentPlayerName === playerOneName);
    this.set('playerOneIsActive', playerOneIsActive);
  },

  startGame() {
    this.enableInputs();
    this.setActivePlayerMessage(AWAITING_INPUT);
  },

  setActivePlayerMessage(message) {
    if(this.getPlayerOneIsActive()) {
      this.setPlayerOneMessage(message);
    } else {
      this.setPlayerTwoMessage(message);
    }
    game.save();
  },

  getPlayerOneIsActive() {
    return this.get('playerOneIsActive');
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
  },

  setPlayerOneMessage(message) {
    this.set('playerOneMessage', message);
  },

  setPlayerTwoMessage(message) {
    this.set('playerTwoMessage', message);
  },

  getCurrentPlayerName() {
    return this.get('currentPlayerName');
  },

  enableInputs() {
    this.set('inputsDisabled', false);
  }

});
