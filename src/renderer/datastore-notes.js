import Datastore from 'nedb';
import path from 'path';
import fs from 'fs';
// eslint-disable-next-line
import { remote } from 'electron';

const dbNotes = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/notes.db'),
});

// Doing the migration
if (fs.existsSync(path.join(remote.app.getPath('userData'), '/snippets.db'))) {
  const dbSnippets = new Datastore({
    autoload: true,
    filename: path.join(remote.app.getPath('userData'), '/snippets.db'),
  });

  dbSnippets.find({}, (err, snippets) => {
    snippets.forEach(snippet => {
      const note = {};
      note.id = snippet._id;
      note.name = snippet.name;
      note.description = snippet.description;
      note.files = {};
      note.files[`${snippet.name}`] = {
        language: snippet.language,
        content: snippet.content,
      };
      note.createdAt = new Date();
      note.updatedAt = new Date();
      dbNotes.insert(note);
    });
    fs.unlinkSync(path.join(remote.app.getPath('userData'), '/snippets.db'));
    remote.getCurrentWindow().reload();
  });
}

export default dbNotes;
