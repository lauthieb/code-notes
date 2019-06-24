import utils from '../utils';

describe('Create Note', function () {
  beforeEach(utils.beforeEach);
  afterEach(utils.afterEach);

  it('create a note, check DOM content', function () {
    this.app.client.addCommand('getUserDataPath', function () {
      return this.execute(function () {
        return require('electron').remote.app.getPath('userData');
      });
    });

    return this.app.client.waitUntilWindowLoaded()
      .$('button#add-note').click()
      .$('.modal-card-body .field.is-horizontal:nth-child(1) input')
      .setValue('aNote')
      .$('.modal-card-body .field.is-horizontal:nth-child(2) input')
      .setValue('a description')
      .$('.note-file .field.is-horizontal:nth-child(1) input')
      .setValue('aFile')
      .execute(() => {
        // eslint-disable-next-line no-undef
        ace.edit('editor').session.insert(0, 'my code stuff');
      })
      .$('footer button.is-primary')
      .click()
      .$('body')
      .getHTML(false)
      .then((content) => {
        expect(content).to.contain('my code stuff');
        const fs = require('fs-extra');
        this.app.client.getUserDataPath().then((path) => {
          fs.removeSync(path.value);
        });
      });
  });

  it('create a note,  check if file was written to filesystem', function () {
    this.app.client.addCommand('getUserDataPath', function () {
      return this.execute(function () {
        return require('electron').remote.app.getPath('userData');
      });
    });

    return this.app.client.waitUntilWindowLoaded()
      .$('button#add-note').click()
      .$('.modal-card-body .field.is-horizontal:nth-child(1) input')
      .setValue('aNote')
      .$('.modal-card-body .field.is-horizontal:nth-child(2) input')
      .setValue('a description')
      .$('.note-file .field.is-horizontal:nth-child(1) input')
      .setValue('aFile')
      .execute(() => {
        // eslint-disable-next-line no-undef
        ace.edit('editor').session.insert(0, 'my code stuff');
      })
      .$('footer button.is-primary')
      .click()
      .getUserDataPath()
      .then((appPath) => {
        const path = require('path');
        const fs = require('fs-extra');
        const noteDir = fs.readdirSync(path.join(appPath.value, 'notes'))[0];
        const fileContent = fs.readFileSync(path.join(appPath.value, 'notes', noteDir, 'aFile.text'), 'utf8');
        expect(fileContent).to.contain('my code stuff');
        this.app.client.getUserDataPath().then((path) => {
          fs.removeSync(path.value);
        });
      });
  });
});
