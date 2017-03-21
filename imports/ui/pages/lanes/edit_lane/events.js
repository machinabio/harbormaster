import { Template } from 'meteor/templating';
import { Lanes } from '../../../../api/lanes/lanes.js';

let update_harbor = function (template) {
  let inputs = template.$('.harbor').find('input');
  let values = {};
  let lane = Session.get('lane');

  _.each(inputs, function (element) {
    values[element.name] = element.value;
  });

  return Meteor.call(
    'Harbors#update',
    lane,
    values,
    function update_harbor (err, res) {
      if (err) throw err;

      lane.minimum_complete = res;
      Lanes.update(lane._id, lane);
      Session.set('lane', lane);
    }
  );
};

Template.edit_lane.events({
  'submit form': function submit_form (event, template) {
    event.preventDefault();

    return update_harbor(template);
  },

  'change form': function change_form (event, template) {
    let lane = Session.get('lane');
    let saved_lane = Lanes.findOne(lane._id);

    if (
      lane.name &&
      lane.name != 'New' &&
      lane.type
    ) {

      return update_harbor(template);
    }
  },

  'change .lane-name': function change_lane_name (event) {
    let lane = Session.get('lane');
    lane.name = event.target.value;
    Session.set('lane', lane);
    if (Lanes.findOne(lane._id)) { Lanes.update(lane._id, lane); }
    FlowRouter.go('/lanes/' + lane.name + '/edit');
  },

  'change .captains': function change_captains (event) {
    let lane = Session.get('lane');
    let captains = lane.captains || [];
    let user = event.target.value;

    if (event.target.checked) {
      captains.push(user);
    } else {
      captains = _.reject(captains, function remove_captain (captain) {
        return captain == user;
      });
    }
    lane.captains = captains;

    Session.set('lane', lane);
    if (Lanes.findOne(lane._id)) { Lanes.update(lane._id, lane); }
  },

  'click .add-harbor': function add_destination (event) {
    event.preventDefault();

    return Session.set('choose_type', true);
  },

  'click .back-to-lanes': function back_to_lanes (event) {
    event.preventDefault();

    Session.set('lane', null);
    return FlowRouter.go('/lanes');
  },

  'click .choose-harbor-type': function choose_harbor_type (event) {
    event.preventDefault();

    let type = $(event.target).attr('data-type');
    let lane = Session.get('lane');

    lane.type = type;
    Session.set('lane', lane);
    return Lanes.upsert({ _id: lane._id }, lane);
  }
});
