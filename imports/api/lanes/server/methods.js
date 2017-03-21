import { Lanes } from '../lanes';
import uuid from 'uuid';

Meteor.publish('Lanes', function () {
  return Lanes.find();
});

Meteor.methods({
  'Lanes#update_webhook_token': function (lane_id, user_id, remove) {
    let lane = Lanes.findOne(lane_id);
    let token = uuid.v4();

    if (lane.tokens && remove) {
      let tokens = _.invert(lane.tokens);
      delete tokens[user_id];
      lane.tokens = tokens;
    }

    lane.tokens = lane.tokens || {};

    if (! remove) lane.tokens[token] = user_id;

    return Lanes.update(lane_id, lane);
  },

  'Lanes#start_shipment': function (id, manifest) {
    if (
      typeof id != 'string' ||
      (manifest && typeof manifest != 'object')
    ) {
      throw new TypeError(
        'Improper arguments for "Lanes#start_shipment" method!', '\n',
        'The first argument must be a String; the _id of the lane.', '\n',
        'The second argument, if present, must be an object;' +
          'parameters to pass to the Harbor.'
      );
    }

    let lane = Lanes.findOne(id);
    let date = new Date();
    let shipment_start_date = date.getFullYear() + '-' +
      date.getMonth() + '-' +
      date.getDate() + '-' +
      date.getHours() + '-' +
      date.getMinutes() + '-' +
      date.getSeconds()
    ;
    let new_manifest;

    manifest.shipment_start_date = shipment_start_date;
    lane.shipment_active = true;
    lane.latest_shipment = shipment_start_date;
    lane.date_history = lane.date_history || {};
    lane.date_history[shipment_start_date] = {
      actual: new Date()
    };
    Lanes.update(lane_id, lane);

    console.log('Starting shipment for lane:', name);
    try {
      new_manifest = $H.harbors[lane.harbor].work(lane, manifest);
    } catch (err) {
      manifest.error = err;
      new_manifest = manifest;
    }

    if (manifest.error && lane.salvage_plan) {
      let exit_code = 1;
      Meteor.call('Lanes#end_shipment', lane, exit_code, new_manifest);
      return Meteor.call(
        'Lanes#start_shipment', lane.salvage_plan, new_manifest
      );
    }

    if (lane.queue) {
      console.log('Shipment started for lane', name + ':', started);
      return lane;
    }

    return new_manifest;
  },

  'Lanes#end_shipment': function (lane, exit_code, manifest) {
    if (
      typeof name != 'string' ||
      (typeof exit_code != 'string' || typeof exit_code != 'number') ||
      (manifest && typeof manifest != 'object')
    ) {
      throw new TypeError(
        'Invalid arguments for "Lanes#end_shipment" method!', '\n',
        'The first argument must be a reference to a lane object.', '\n',
        'The second argument must be the exit code of the finished work; ' +
          'An Integer or String representing one.', '\n',
        'The third argument, if present, must be an object;' +
          'The (modified) manifest object originally passed to the Harbor.'
      );
    }

    let date = manifest.shipment_start_date;

    lane.date_history[date].finished = new Date();
    lane.date_history[date].exit_code = exit_code;
    lane.date_history[date].manifest = manifest;
    lane.shipment_active = false;

    Lanes.update(lane_id, lane);
    console.log('Shipping completed for lane:', name);

    if (exit_code != 0 && lane.salvage_plan) {
      return Meteor.call('Lanes#start_shipment', lane.salvage_plan, manifest);
    }

    if (exit_code == 0 && lane.followup) {
      return Meteor.call('Lanes#start_shipment', lane.followup, manifest)
    }

    return manifest;

  },

  'Lanes#abort_shipment': function (name) {
    let lane = Lanes.findOne({ name: name });

    lane.shipment_active = false;

    return Lanes.update(lane._id, lane);
  }
});

