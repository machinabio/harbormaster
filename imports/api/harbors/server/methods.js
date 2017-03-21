import { Harbors } from '..';

Meteor.publish('Harbors', function () {
  return Harbors.find();
});

Meteor.methods({
  'Harbors#update': function update_harbor (lane, values) {
    try {
      return $H.harbors[lane.type].update(lane, values);
    } catch (err) {
      throw err;
    }
  }
})
