describe('Manifest', () => {
  const manifestV2 = require('../../public/manifest-v2.json');
  const manifestV3 = require('../../public/manifest-v3.json');

  describe('v2 has', () => {
    it('correct version property', () => {
      expect(manifestV2).toHaveProperty('manifest_version', 2);
    });
  });

  describe('v3 has', () => {
    it('correct version property', () => {
      expect(manifestV3).toHaveProperty('manifest_version', 3);
    });
  });
});

describe('background.js', () => {
  it('Saved color should be valid 7 digit HEX color with dash.', () => {
    // Refer testing for browser extension API:
    // https://lusito.github.io/mockzilla-webextension/setup.html
  });
});
