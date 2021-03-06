import { Meteor } from 'meteor/meteor';

import '../imports/startup/config/namespace';
import '../imports/startup/config/login';
import '../imports/startup/server/accounts';
import '../imports/startup/server/routes';
import '../imports/startup/server/harbors';

import { Captains } from '../imports/api/captains';
import { Harbormasters } from '../imports/api/harbormasters';
import { Lanes } from '../imports/api/lanes';
import { Shipments } from '../imports/api/shipments';
import { Users } from '../imports/api/users';
import { Harbors } from '../imports/api/harbors';
import '../imports/api/lanes/server';
import '../imports/api/users/server';
import '../imports/api/harbors/server';
import '../imports/api/shipments/server';

console.log('Modules loaded.');
Meteor.startup(() => {
  console.log('Server started.');
});
