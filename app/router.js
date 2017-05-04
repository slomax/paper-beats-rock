import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('home', { path: '/join/:gameId'});
  this.route('home');
  this.route('game', { path: '/game/:gameId' });
});

export default Router;
