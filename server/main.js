import { Meteor } from 'meteor/meteor';

import '../imports/startup/config/namespace';
import '../imports/startup/config/login';
import '../imports/startup/server/accounts';
import '../imports/startup/server/routes';
import '../imports/startup/server/harbors';

import { Captains } from '../imports/api/captains/captains';
import { Harbormasters } from '../imports/api/harbormasters/harbormasters';
import { Lanes } from '../imports/api/lanes/lanes';
import { SalvagePlans } from '../imports/api/lanes/salvage_plans/salvage_plans';
import { Shipments } from '../imports/api/shipments/shipments';
import { Stops } from '../imports/api/stops/stops';
import { Users } from '../imports/api/users/users';
import { Harbors } from '../imports/api/harbors';
import '../imports/api/lanes/server/methods';
import '../imports/api/users/server/methods';
import '../imports/api/harbors/server/methods';

console.log('Modules loaded.');
Meteor.startup(() => {
  console.log('Server started.');
});
