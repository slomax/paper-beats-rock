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
  },
  //TODO: This is the quick and dirty solution to ensuring that showNameDialog is always true
  //when this route is first activated.  I should probably convert 'game' to be a component,
  //which supposedly has lifecycle hooks I can use to reset whatever values I need.  For now,
  //this seems to work.
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('showNameDialog', true);
    controller.set('currentPlayerName', '');
    controller.set('inputsDisabled', true);
    controller.set('playerOneIsActive', false);
    controller.set('status', 'VS');

  }
});
