[![Lint](https://github.com/alxflam/localizer/actions/workflows/lint.yml/badge.svg)](https://github.com/alxflam/localizer/actions/workflows/lint.yml)

# localizer
Localization tool for ARB files built with Theia.

## Getting started

Install prerequistes as described here: https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#prerequisites

Install node-native-keymap as described here: https://github.com/Microsoft/node-native-keymap

Install [nvm](https://github.com/creationix/nvm#install-script).

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash

Install npm and node.

    nvm install 12.14.1
    nvm use 12.14.1

Install yarn.

    npm install -g yarn

## Checkout

    Checkout repository
    yarn 

## Running the browser example

    yarn rebuild:browser
    cd browser-app
    yarn start

Open http://localhost:3000 in the browser.

## Running the Electron example

    yarn rebuild:electron
    cd electron-app
    yarn start

## Developing with the browser example

Start watching of @localizer/core.

    cd core
    yarn watch

Start watching of the browser example.

    yarn rebuild:browser
    cd browser-app
    yarn watch

Launch `Start Browser Backend` configuration from VS code.

Open http://localhost:3000 in the browser.

## Developing with the Electron example

Start watching of @localizer/core.

    cd core
    yarn watch

Start watching of the electron example.

    yarn rebuild:electron
    cd electron-app
    yarn watch

Launch `Start Electron Backend` configuration from VS code.

##  TODO

- [X] Seperate packages into core, branding and format specific implementations, e.g. arb
- [X] Change applicatonName from default
- [X] Add git extension to app
- [X] Reuse @theia/getting-started extension for branding extension
- [X] Clean up Getting Started page
- [X] Provide electron build for linux
- [X] Provide GH action for linting
- [X] Use a custom configuration drectory instead of .theia
- [X] Translation file view should itself provide a dirty state and be saveable
- [X] Basic styling for input fields in file view
- [ ] Add new language resource
- [ ] Translation file view should display key metadata
- [ ] Translation Preview should allow editing
- [ ] Translation Group View should display all translations dynamically
    - [ ] add editing
- [ ] Translation Navigator should indicate status
    - [ ] translated, missing translation, and their counts
- [ ] Navigator double-click should open translation dialog for selected key
- [ ] Add translation providers
    - [X] Deepl
        - [ ] Add support for multi value translation (in single request)
    - [X] LibreTranslate
    - [ ] Google Translate
- [ ] Automate electron build using github actions
