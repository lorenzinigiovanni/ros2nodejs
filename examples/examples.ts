/* eslint-disable no-console */

import { param } from './param';
import { service } from './service';
import { topic } from './topic';
import { action } from './action';

(async () => {
    await topic();
    await service();
    await param();
    await action();
})();
