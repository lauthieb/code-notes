/**
 * @jest-environment node
 */
const spectron = require("spectron");
const { testWithSpectron } = require("vue-cli-plugin-electron-builder");
jest.setTimeout(50000);

describe("Window loads properly", () => {
  let app;
  let stopServe;
  let client;
  let win;

  beforeEach(async () => {
    // Wait for dev server to start
    const x = await testWithSpectron(spectron);
    app = x.app;
    stopServe = x.stopServe;
    client = app.client;
    win = app.browserWindow;
  });

  afterEach(async () => {
    await stopServe();
  });

  it("serve", async () => {
    // Window was created
    expect(await client.getWindowCount()).toBe(1);
    // It is not minimized
    expect(await win.isMinimized()).toBe(false);
    // Window is visible
    expect(await win.isVisible()).toBe(true);
    // Size is correct
    const { width, height } = await win.getBounds();
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
    // App is loaded properly
    expect(await client.getTitle()).toBe("code-notes");
  });
});
