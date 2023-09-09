# React TS starter for extensions

**A Cross-platform React TS starter for browser extensions.**

![build](https://github.com/mcanvar/react-ts-starter-for-extensions/workflows/build/badge.svg)

## Description

This template is prepared for making cross-platform extension
development in a single React Project with ease. It is also using a browser
polyfill to match the API codebase and use them as Promises. During the
development you can build your extension automatically via WebPack and
thanks to `web-ext` it can reload it by watching the changes.

## Why?

There are a couple of problems when we decide to develop an extension for the most common browsers:

- We cannot use Manifest V3 yet in Firefox except by turning on the developer preview
  manually. [see here](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/).
- All the Chrome APIs do not yet support Promise-based approaches.
- During the development, we need to reload extension every time we update the codes.
- Packing the bundles and getting the extension ready for publishing can be time-consuming.

## Prerequisites

- Already installed Firefox or Chrome browser
- [node + npm](https://nodejs.org/)
- [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) (Included as dependency of it's webpack extension)

## Includes the following

- TypeScript
- Webpack
- React
- Jest
- Example Code Includes:
  - background.js
  - Options page
  - Content script
  - Pop-up
  - [Storage API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/local)
  - [Tabs API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs)
  - [WebExtension browser API Polyfill](https://github.com/mozilla/webextension-polyfill)
  - [web-ext & Its WebPack Plugin](https://github.com/mozilla/web-ext)

## Project Structure

```yaml
/react-ts-starter-for-extensions
  ├── dist
  │   ├── js # Generated code bundles
  │   └── ...
  ├── public
  │   └── ... # Static files
  ├── src
  │   ├── __tests__ # Jest tests folder
  │   ├── types # TS Types folder
  │   ├── utils # Utility codes folder
  │   ├── background.ts # Extension's background file
  │   ├── content_script.ts # The script will be injected to the page
  │   ├── options.ts # Extension's settings page
  │   └── popup.ts # Extension's pop-up page
  ├── webpack
  │   ├── webpack.common.js # Common tasks
  │   ├── webpack.dev.js # Dev related tasks
  │   └── webpack.prod.js # Prod related tasks
...
```

Feel free to remove the parts that you do not need and
then edit the webpack config files.

## Setup & Usage

Press "Use this template" button above and then clone the project on your local.

#### Installing dependencies:

```
npm install
```

### Build in watch mode

#### For running Firefox with Manifest v2:

```
npm run watch
```

#### For running Chrome with Manifest v3:

```
npm run watch:c
```

### Building for production

#### For Firefox with Manifest v2:

```
npm run build
```

#### For Chrome with Manifest v3:

```
npm run build:c
```

### Cleaning & Testing

#### To clean `dist` folder:

```
npm run clean
```

#### To test:

```
npm run test
```

To further testing, you might want to have a look
at [mockzilla](https://lusito.github.io/mockzilla-webextension/setup.html).

## Deep diving

You might want to check out `web-ext` CLI documentation in order to experience
further settings. You can run the extension with any version of browsers,
or passing different folder setups. You can even test Manifest V3 on Firefox by
passing `firefoxPreview`option with`'mv3'` value on webpack config.

## Big thanks

- For inspiring me, [@chibat](https://github.com/chibat/chrome-extension-typescript-starter)
- For making this possible via amazing tools, Mozilla's Teams and Contributors
- For automatizing, WebPack

## Contribution

If you ever think that something useful can be added, please do not
hesitate to open a PR with a new branch.

## In case you want to support me, or contact me

<a href="https://www.buymeacoffee.com/mcanvar" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

You can always text me via Twitter DM.
