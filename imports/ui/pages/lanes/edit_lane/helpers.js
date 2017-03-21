import { Template } from 'meteor/templating';
import { Lanes } from '../../../../api/lanes/lanes.js';
import { Session } from 'meteor/session';
import { Users } from '../../../../api/users/users.js';
import { Harbors } from '../../../../api/harbors';
import { moment } from 'meteor/momentjs:moment';

let AMOUNT_SHOWN = 20;

Template.edit_lane.helpers({
  lane_name (current_name) {
    var name = FlowRouter.getParam('name');
    var lane = Lanes.findOne({ name: name }) ||
      Session.get('lane') ||
      {}
    ;

    lane.name = lane.name || 'New';

    Session.set('lane', lane);

    return lane.name == 'New' ? '' : lane.name;
  },

  lane (sort_order) {
    var name = FlowRouter.getParam('name');
    var lane = Lanes.findOne({ name: name });
    var START_INDEX = 0;
    var END_INDEX = AMOUNT_SHOWN - 1;

    if (sort_order == 'history' && lane) {
      return lane.date_history ?
        lane.date_history.reverse().slice(START_INDEX, END_INDEX) :
        []
      ;
    }
    return lane;
  },

  shipping_log_amount_shown () {
    return AMOUNT_SHOWN;
  },

  validate_done () {
    if (! Session.get('lane') || ! Session.get('lane').minimum_complete) {
      return true;
    }

    return false;
  },

  has_followup () {
    return false;
  },

  has_salvage_plan () {
    return false;
  },

  captain_list () {
    var users = Users.find().fetch();

    return users;
  },

  can_ply () {
    var lane = Session.get('lane');

    if (this.harbormaster) { return true; }

    if (lane.captains && lane.captains.length) {
      let user = this._id;

      return _.find(lane.captains, function (captain) {
        return user == captain;
      }) ?
        true :
        false
      ;
    }

    return false;
  },

  plying () {
    var lane = Session.get('lane');
    var user = Users.findOne(Meteor.user().emails[0].address);

    if (user && user.harbormaster) { return true; }

    if (lane.captains && lane.captains.length) {
      let captain = _.find(lane.captains, function (email) {
        return email == Meteor.user().emails[0].address;
      });

      return captain ? true : false;
    }

    return false;
  },

  can_set_ply () {
    var user = Users.findOne(Meteor.user().emails[0].address);

    if (this.harbormaster) { return true; }

    if (user) { return ! user.harbormaster; }

    return false;
  },

  pretty_date (date) {
    return new Date(date).toLocaleString();
  },

  duration () {
    return moment.duration(this.finished - this.actual).humanize();
  },

  harbors () {
    let harbors = Harbors.find().fetch();

    return harbors;
  },

  choose_type () {
    return Session.get('choose_type');
  },

  current_lane () {
    return Session.get('lane');
  },

  lane_type () {
    return Session.get('lane').type;
  },

  render_harbor () {
    let lane = Session.get('lane');
    let harbor = Harbors.findOne(lane.type);

    if (harbor.lanes[lane._id] && harbor.lanes[lane._id].rendered_html) {
      return harbor.lanes[lane._id].rendered_html;
    }

    return harbor.rendered_html;
  }

});

