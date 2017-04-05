import { Template } from 'meteor/templating';
import { Lanes } from '../../../../api/lanes/lanes.js';
import { Session } from 'meteor/session';
import { Harbors } from '../../../../api/harbors';
import { moment } from 'meteor/momentjs:moment';

//TODO: expose this
let AMOUNT_SHOWN = 20;

Template.ship_lane.helpers({
  lane (sort_order) {
    var name = FlowRouter.getParam('name');
    var lane = Lanes.findOne({ name: name });
    var START_INDEX = 0;
    var END_INDEX = AMOUNT_SHOWN - 1;

    Session.set('lane', lane);

    if (sort_order == 'history' && lane && lane.date_history) {
      let dates = Object.keys(lane.date_history);
      let relevant_dates = dates.reverse().slice(START_INDEX, END_INDEX);
      let logs = _.pick(lane.date_history, relevant_dates);

      return _.values(logs);
    }

    return lane ? lane : false;
  },

  pretty_date (date) {
    return new Date(date).toLocaleString();
  },

  shipping_log_amount_shown () {
    return AMOUNT_SHOWN;
  },

  shipment_started () {
    return Session.get('shipment_started');
  },

  results () {
    var date = FlowRouter.getParam('date');
    var stdout = this.stdout_history ?
      _.where(this.stdout_history, { start_date: date }) :
      false
    ;
    var stderr = this.stderr_history ?
      _.where(this.stderr_history, { start_date: date }) :
      false
    ;
    var results = [];

    if (date && (stdout && stdout.length)) {
      _.each(stdout, function (result) {
        results.push({
          result: result.stdout,
          address: result.address,
          command: result.command
        });
      });
    } else if (date && (stderr && stderr.length)) {
      _.each(stderr, function (result) {
        results.push({
          result: result.stderr,
          address: result.address,
          command: result.command
        })
      });
    }

    if (results.length) { return results; }
    return false;
  },

  filter_results_by_address (results, address, command) {
    var matching_command = _.where(results, {
      address: address,
      command: command
    });
    var results = '';

    if (matching_command.length) {
      _.each(matching_command, function (command) {
        results += command.result;
      });

      return results;
    }

    return '';

  },

  exit_code () {
    let name = FlowRouter.getParam('name');
    let current_date = FlowRouter.getParam('date');
    let lane = Session.get('lane') || Lanes.findOne({ name: name });
    let last_date = lane.latest_shipment;
    let exit_code = lane.date_history && lane.date_history[last_date] ?
      lane.date_history[last_date].exit_code :
      ''
    ;

    if (current_date && typeof exit_code == 'number') return exit_code;

    return false;
  },

  active () {
    let name = FlowRouter.getParam('name');
    let lane = Session.get('lane') || Lanes.findOne({ name: name });

    if (lane.shipment_active) return 'active';

    return '';
  },

  work_preview () {
    let name = FlowRouter.getParam('name');
    let lane = Session.get('lane') || Lanes.findOne({ name: name });

    let harbor = Harbors.findOne(lane.type);
    let manifest = harbor.lanes[lane._id] ?
      harbor.lanes[lane._id].manifest :
      false
    ;

    if (! lane.work_preview_html) {
      Meteor.call(
        'Harbors#render_work_preview',
        lane,
        manifest,
        function (err, lane) {
          if (err) throw err;

          Session.set('lane', lane);
        }
      );
    }

    return lane.rendered_work_preview;
  },

  duration () {
    return moment.duration(this.finished - this.actual).humanize();
  },

  followup_name (lane) {
    let followup = Lanes.findOne(lane.followup);

    return followup ? followup.name : false;
  }

});
