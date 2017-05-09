import Ember from 'ember';

const AWAITING_INPUT = 'Enter your choice!'
const ROCK = "ROCK";
const PAPER = "PAPER";
const SCISSORS = "SCISSORS";

const INITIAL_STATUS = 'VS';
const WAITING = 'Waiting for other player.';

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

  //TODO: refactor this horrible function
  updateStatusWithResult() {
    const game = this.getGameRecord(),
          playerOneChoice = game.getPlayerOneChoice(),
          playerTwoChoice = game.getPlayerTwoChoice(),
          playerOneIsActive = this.isPlayerOneActive(),
      //TODO: couldn't access gameRules when I defined it as a const?
          gameRules = {
            [ROCK] : SCISSORS,
            [PAPER] : ROCK,
            [SCISSORS] : PAPER
          };
    let playerOneWon = false,
        playersTied = false;

    if(gameRules[playerOneChoice] === playerTwoChoice) {
      playerOneWon = true;
    } else if (playerOneChoice === playerTwoChoice) {
      playersTied = true;
    } else {
      playerOneWon = false;
    }
    //todo: create setStatus
    if(playersTied) {
      this.set('status', 'TIE!');
    } else {
      if(playerOneIsActive) {
        if(playerOneWon) {
          this.set('status', 'YOU WON!');
          this.incrementProperty('playerOneScore');
        } else {
          this.incrementProperty('playerTwoScore');
          this.set('status', 'YOU LOST!');
        }
      } else {
        if(playerOneWon) {
          this.set('status', 'YOU LOST!');
          this.incrementProperty('playerOneScore');
        } else {
          this.set('status', 'YOU WON!');
          this.incrementProperty('playerTwoScore');
        }
      }
    }
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
    if(this.isPlayerOneActive()) {
      this.setPlayerOneMessage(message);
    } else {
      this.setPlayerTwoMessage(message);
    }
  },

  clearInactivePlayerMessage() {
    this.setInactivePlayerMessage('');
  },

  setInactivePlayerMessage(message) {
    if(this.isPlayerOneActive()) {
      this.setPlayerTwoMessage(message);
    } else {
      this.setPlayerOneMessage(message);
    }
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
  },

  disableInputs() {
    this.set('inputsDisabled', true);
  },

  resetStatus() {
    this.setStatus(INITIAL_STATUS);
  },

  setStatus(status) {
    this.set('status', status);
  },

  showPlayAgainButton() {
    this.set('showPlayAgainButton', true);
  },

  hidePlayAgainButton() {
    this.set('showPlayAgainButton', false);
  }

});
