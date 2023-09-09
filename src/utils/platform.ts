import browser from 'webextension-polyfill';

export default class Platform {
  #extensionPath: string;

  constructor(extensionPath: string) {
    this.#extensionPath = extensionPath;
  }

  #parseUrl() {
    return browser.runtime.getURL('').startsWith(this.#extensionPath);
  }

  static isChrome() {
    return new Platform('chrome-extension://').#parseUrl();
  }

  static isFirefox() {
    return new Platform('moz-extension://').#parseUrl();
  }
}
