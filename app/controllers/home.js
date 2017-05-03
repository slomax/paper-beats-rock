import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createNewGame() {
      var newPost = this.store.createRecord('game', {
        title: 'EmberFire is flaming hot!'
      });
      newPost.save();
    },
    joinGame() {
      console.log('join');
    }
  }
});
