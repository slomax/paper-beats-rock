import Ember from 'ember';

export default Ember.Route.extend({

  activate() {
    var newPost = this.store.createRecord('game', {
      title: 'EmberFire is flaming hot!'
    });
    newPost.save();
  },

  model() {
    return this.get('store').findAll('game');
  }
});
