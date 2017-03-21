import { Template } from 'meteor/templating';
import { Lanes } from '../../../../api/lanes/lanes.js';
import { Session } from 'meteor/session';

Template.ship_lane.onCreated(function () {
  debugger;
})

Template.ship_lane.helpers({
  lane () {
    debugger;
    var name = FlowRouter.getParam('name');
    var lane = Lanes.findOne({ name: name });

    Session.set('lane', lane);

    return lane ? lane : false;
  },

  shipment_started () {
    debugger;
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
    var date = FlowRouter.getParam('date');
    var exit_code = this.exit_code_history ?
      _.where(this.exit_code_history, {
        start_date: date
      }) :
      false
    ;

    return exit_code.length ? exit_code[0].code : '';
  }

});
