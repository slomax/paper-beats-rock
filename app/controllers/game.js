import Ember from 'ember';

const AWAITING_INPUT = 'Enter your choice!'
const ROCK = "ROCK";
const PAPER = "PAPER";
const SCISSORS = "SCISSORS";

const INITIAL_STATUS = 'VS';
const WAITING = 'Waiting for other player.';

const TIE = 'TIE!';
const YOU_WON = 'YOU WON!';
const YOU_LOST = 'YOU LOST!';

const gameRules = {
  [ROCK] : SCISSORS,
  [PAPER] : ROCK,
  [SCISSORS] : PAPER
};

export default Ember.Controller.extend({

  usernameTextFieldValue: '',
  showNameDialog: true,
  currentPlayerName: '',
  inputsDisabled: true,
  playerOneMessage: '',
  playerTwoMessage: '',
  playerOneIsActive: false,
  showStatus: true,
  status: INITIAL_STATUS,
  showPlayAgainButton: false,
  playerOneScore: 0,
  playerTwoScore: 0,

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
    handlePlayAgain() {
      const game = this.getGameRecord();
      this.hidePlayAgainButton();
      this.resetActivePlayerChoice();
      this.clearInactivePlayerMessage();
      this.resetStatus();
      game.save();
      if(game.bothPlayerChoicesAreEmpty()) {
        this.enableInputs();
        this.setActivePlayerMessage(AWAITING_INPUT);
      } else {
        this.setActivePlayerMessage(WAITING);
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

  playerOneChoiceChanged: Ember.observer('model.playerOneChoice', function() {
    const game = this.getGameRecord();
    if(!this.isPlayerOneActive()) {
      const playerOneChoice = game.getPlayerOneChoice();
      if(game.isGameStarted() && playerOneChoice.length === 0  && !this.get('showPlayAgainButton')) {
        this.enableInputs();
        this.setActivePlayerMessage(AWAITING_INPUT);
      }
    }
  }),

  playerTwoChoiceChanged: Ember.observer('model.playerTwoChoice', function() {
    const game = this.getGameRecord();
    if(this.isPlayerOneActive()) {
      const playerTwoChoice = game.getPlayerTwoChoice();
      if(game.isGameStarted() && playerTwoChoice.length === 0 && !this.get('showPlayAgainButton')) {
        this.enableInputs();
        this.setActivePlayerMessage(AWAITING_INPUT);
      }
    }
  }),

  gameStartedChanged: Ember.observer('model.gameStarted', function() {
    const game = this.getGameRecord();
    if(game.isGameStarted() && this.isPlayerOneActive()) {
      this.startGame();
    }
  }),

  timerChanged: Ember.observer('model.timer', function() {
    const game = this.getGameRecord();
    if( game.isGameStarted() && game.getTimer() === 0) {
      this.set('showStatus', true);
      this.updateStatusWithResult();
      const inactivePlayerChoice = this.isPlayerOneActive() ? game.getPlayerTwoChoice() : game.getPlayerOneChoice();
      this.setInactivePlayerMessage(inactivePlayerChoice);
      this.set('showPlayAgainButton', true);
    } else {
      this.set('showStatus', false);
    }
  }),

  saveGameRecordWithNewPlayer() {
    const game = this.getGameRecord(),
      newPlayerName = this.getUsernameTextFieldValue();
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

  saveUserNameTextAsCurrentPlayerName() {
    const usernameTextFieldValue = this.getUsernameTextFieldValue();
    this.set('currentPlayerName', usernameTextFieldValue);
  },

  determineIfPlayerOneIsActive() {
    const game = this.getGameRecord(),
      currentPlayerName = this.getCurrentPlayerName(),
      playerOneName = game.getPlayerOneName(),
      playerOneIsActive = (currentPlayerName === playerOneName);
    this.set('playerOneIsActive', playerOneIsActive);
  },

  resetNameDialog() {
    this.clearUsernameTextFieldValue();
    this.hideNameDialog();
  },

  startGame() {
    this.enableInputs();
    this.setActivePlayerMessage(AWAITING_INPUT);
  },

  updateStatusWithResult() {
    const game = this.getGameRecord(),
          playerOneChoice = game.getPlayerOneChoice(),
          playerTwoChoice = game.getPlayerTwoChoice(),
          playersTied = playerOneChoice === playerTwoChoice;

    if(playersTied) {
      this.setStatus(TIE);
    } else {
      this.updateGameResults();
    }
  },

  updateGameResults() {
    const playerOneIsActive = this.isPlayerOneActive(),
          playerOneWon = this.determineIfPlayerOneWon();
    if(playerOneIsActive) {
      if(playerOneWon) {
        this.setStatus(YOU_WON);
        this.incrementPlayerOneScore();
      } else {
        this.incrementPlayerTwoScore();
        this.setStatus(YOU_LOST);
      }
    } else {
      if(playerOneWon) {
        this.setStatus(YOU_LOST);
        this.incrementPlayerOneScore();
      } else {
        this.setStatus(YOU_WON);
        this.incrementPlayerTwoScore();
      }
    }
  },

  updateGameResultsForActivePlayer() {
    const playerOneIsActive = this.isPlayerOneActive(),
          playerOneWon = this.determineIfPlayerOneWon();
    let scoreToIncrement
    if(playerOneIsActive) {

    }
  },

  determineIfPlayerOneWon() {
    const game = this.getGameRecord(),
          playerOneChoice = game.getPlayerOneChoice(),
          playerTwoChoice = game.getPlayerTwoChoice();
    return gameRules[playerOneChoice] === playerTwoChoice;
  },

  handleChoice(choice) {
    const game = this.getGameRecord();
    this.disableInputs();
    this.setActivePlayerMessage(choice);
    this.saveActivePlayerChoice(choice);
    if(game.bothPlayersHaveChosen()) {
      game.setTimer(3);
      game.save();
      this.set('showStatus', false);
      const timerInterval = setInterval(() => {
        const newTimer = game.getTimer() - 1;
        game.setTimer(newTimer);
        game.save();
        if(newTimer === 0) {
          clearInterval(timerInterval);
        }
      }, 1000);
    }
  },

  saveActivePlayerChoice(choice) {
    const game = this.getGameRecord();
    if(this.isPlayerOneActive()) {
      game.setPlayerOneChoice(choice);
    } else {
      game.setPlayerTwoChoice(choice);
    }
    game.save();
  },

  setActivePlayerMessage(message) {
    if(this.isPlayerOneActive()) {
      this.setPlayerOneMessage(message);
    } else {
      this.setPlayerTwoMessage(message);
    }
  },

  clearInactivePlayerMessage() {
    this.setInactivePlayerMessage('');
  },

  resetActivePlayerChoice() {
    const game = this.getGameRecord();
    if(this.isPlayerOneActive()) {
      game.setPlayerOneChoice('');
    } else {
      game.setPlayerTwoChoice('');
    }
  },

  isPlayerOneActive() {
    return this.get('playerOneIsActive');
  },

  gameHasFirstPlayer() {
    const game = this.getGameRecord();
    return game.getPlayerOneName().length > 0;
  },

  clearUsernameTextFieldValue() {
    this.set('usernameTextFieldValue', '');
  },

  hideNameDialog() {
    this.set('showNameDialog', false);
  },

  enableInputs() {
    this.set('inputsDisabled', false);
  },

  disableInputs() {
    this.set('inputsDisabled', true);
  },

  resetStatus() {
    this.setStatus(INITIAL_STATUS);
  },

  showPlayAgainButton() {
    this.set('showPlayAgainButton', true);
  },

  hidePlayAgainButton() {
    this.set('showPlayAgainButton', false);
  },

  getGameRecord() {
    return this.get('model');
  },

  getCurrentPlayerName() {
    return this.get('currentPlayerName');
  },

  getUsernameTextFieldValue() {
    return this.get('usernameTextFieldValue');
  },

  setInactivePlayerMessage(message) {
    if(this.isPlayerOneActive()) {
      this.setPlayerTwoMessage(message);
    } else {
      this.setPlayerOneMessage(message);
    }
  },

  setStatus(status) {
    this.set('status', status);
  },

  setPlayerOneMessage(message) {
    this.set('playerOneMessage', message);
  },

  setPlayerTwoMessage(message) {
    this.set('playerTwoMessage', message);
  },

  incrementPlayerOneScore() {
    this.incrementProperty('playerOneScore');
  },

  incrementPlayerTwoScore() {
    this.incrementProperty('playerTwoScore');
  }

});
