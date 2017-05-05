import DS from 'ember-data';

export default DS.Model.extend({
  playerOneName: DS.attr('string'),
  playerTwoName: DS.attr('string'),
  playerOneWins: DS.attr('number'),
  playerTwoWins: DS.attr('number'),
  playerOneChoice: DS.attr('string'),
  playerTwoChoice: DS.attr('string'),
  timer: DS.attr('number'),
  gameStarted: DS.attr('boolean'),
  inputsDisabled: DS.attr('boolean'),

  setPlayerOneName(playerOneName) {
    this.set('playerOneName', playerOneName);
  },
  setPlayerTwoName(playerTwoName) {
    this.set('playerTwoName', playerTwoName);
  },
  setPlayerOneWins(playerOneWins) {
    this.set('playerOneWins', playerOneWins);
  },
  setPlayerTwoWins(playerTwoWins) {
    this.set('playerTwoWins', playerTwoWins);
  },
  setPlayerOneChoice(playerOneChoice) {
    this.set('playerOneChoice', playerOneChoice);
  },
  setPlayerTwoChoice(playerTwoChoice) {
    this.set('playerTwoChoice', playerTwoChoice);
  },
  setTimer(timer) {
    this.set('timer', timer);
  },
  setGameHasStarted(gameHasStarted) {
    this.set('gameStarted', gameHasStarted);
  },
  getPlayerOneName() {
    return this.get('playerOneName');
  },
  getPlayerTwoName() {
    return this.get('playerTwoName');
  },
  getPlayerOneWins() {
    return this.get('playerOneWins');
  },
  getPlayerTwoWins() {
    return this.get('playerTwoWins');
  },
  getPlayerOneChoice() {
    return this.get('playerOneChoice');
  },
  getPlayerTwoChoice() {
    return this.get('playerTwoChoice');
  },
  getTimer() {
    return this.get('timer');
  },
  isGameStarted() {
    return this.get('gameStarted');
  },
  bothPlayersExist() {
    const playerOneName = this.getPlayerOneName(),
      playerTwoName = this.getPlayerTwoName();
    return playerOneName.length > 0 && playerTwoName.length > 0;
  }
});
