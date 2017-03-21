import { Meteor } from 'meteor/meteor';

import '../imports/startup/config/namespace';
import '../imports/startup/config/login';
import '../imports/startup/client/global_helpers';
import '../imports/startup/client/routes';
import '../imports/startup/client/spinner';

import { Captains } from '../imports/api/captains/captains';
import { Harbormasters } from '../imports/api/harbormasters/harbormasters';
import { Lanes } from '../imports/api/lanes/lanes';
import { SalvagePlans } from '../imports/api/lanes/salvage_plans/salvage_plans';
import { Shipments } from '../imports/api/shipments/shipments';
import { Stops } from '../imports/api/stops/stops';
import { Users } from '../imports/api/users/users';
