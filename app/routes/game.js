import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    const game = this.store.find('game', params['gameId']).then((result) => {
      //do something with the game
    });
  }
});
