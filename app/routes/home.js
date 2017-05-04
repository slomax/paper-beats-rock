import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    const gameId = params['gameId'];
    const joiningGame = gameId ? true : false;

    return {
      showNameDialog: joiningGame,
      joiningGame: joiningGame
    }
  }
});
