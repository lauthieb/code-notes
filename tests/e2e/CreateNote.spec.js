/**
 * @jest-environment node
 */
const spectron = require("spectron");
const { testWithSpectron } = require("vue-cli-plugin-electron-builder");
const path = require("path");
const fs = require("fs-extra");
jest.setTimeout(100000);

describe("Create Note", () => {
  let app;
  let stopServe;
  let client;
  let dataPath;

  beforeEach(async () => {
    // Wait for dev server to start
    const x = await testWithSpectron(spectron);
    app = x.app;
    stopServe = x.stopServe;
    client = app.client;
    dataPath = await app.electron.remote.app.getPath("userData");
  });

  afterEach(async () => {
    try {
      await fs.unlink(dataPath);
    } catch (error) {
      console.error(error);
      console.log(
        "If you are on a windows machine, then the unlink of the TEMP directory does not work probably."
      );
      console.log(
        "You can ignore this error. There are several issues found on the internet with the same error"
      );
    }
    await stopServe();
  });

  it("create a note, check DOM content", async () => {
    expect(await client.getTitle()).toBe("code-notes");

    await client
      .$("button#add-note")
      .click()
      .$(".modal-card-body .field.is-horizontal:nth-child(1) input")
      .setValue("aNote")
      .$(".modal-card-body .field.is-horizontal:nth-child(2) input")
      .setValue("a description")
      .$(".note-file .field.is-horizontal:nth-child(1) input")
      .setValue("aFile")
      .execute(() => {
        // eslint-disable-next-line no-undef
        ace.edit("editor").session.insert(0, "my code stuff");
      })
      .$("footer button.is-primary")
      .click()
      .$("body")
      .getHTML(false)
      .then(async content => {
        expect(content).toContain("my code stuff");
      });
  });

  it("create a note, check if file was written to filesystem", async () => {
    await client
      .waitUntilWindowLoaded()
      .$("button#add-note")
      .click()
      .$(".modal-card-body .field.is-horizontal:nth-child(1) input")
      .setValue("aNote")
      .$(".modal-card-body .field.is-horizontal:nth-child(2) input")
      .setValue("a description")
      .$(".note-file .field.is-horizontal:nth-child(1) input")
      .setValue("aFile")
      .execute(() => {
        // eslint-disable-next-line no-undef
        ace.edit("editor").session.insert(0, "my code stuff");
      })
      .$("footer button.is-primary")
      .click()
      .then(() => {
        const noteDir = fs.readdirSync(path.join(dataPath, "notes"))[0];
        const fileContent = fs.readFileSync(
          path.join(dataPath, "notes", noteDir, "aFile.text"),
          "utf8"
        );
        expect(fileContent).toContain("my code stuff");
      });
  });
});
