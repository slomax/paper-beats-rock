import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.store.find('game', params['gameId']);
  },
  afterModel(game) {
    const gameHasStarted = game.isGameStarted();
    if(gameHasStarted) {
      this.transitionTo('home');
    }
  }
});
