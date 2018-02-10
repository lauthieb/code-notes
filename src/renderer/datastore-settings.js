import Datastore from 'nedb';
import path from 'path';
// eslint-disable-next-line
import { remote } from 'electron';

export default new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/settings.db'),
});
