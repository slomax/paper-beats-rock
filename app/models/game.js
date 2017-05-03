import DS from 'ember-data';

export default DS.Model.extend({
  playerOneName: DS.attr('string'),
  playerTwoName: DS.attr('string'),
  playerOneWins: DS.attr('number'),
  playerTwoWins: DS.attr('number'),
  playerOneChoice: DS.attr('string'),
  playerTwoChoice: DS.attr('string'),
  timer: DS.attr('number'),
  hostUser: DS.attr('number')
});
