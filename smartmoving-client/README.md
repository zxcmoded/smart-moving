# SmartMoving Client

All client-related code lives here.

## Prerequisites

### Required

* NodeJS and NPM
  * It's recommended to use [NVM](https://github.com/nvm-sh/nvm) to manage NodeJS versions.
  * NodeJS v12.14.0, NPM 6.13.4 works properly with this version of Angular.
* Angular CLI 12+: https://cli.angular.io/

### Recommended

* Rider
* Failing that, VS Code
* Angular Language Service: https://marketplace.visualstudio.com/items?itemName=Angular.ng-template

The most important part is that your editor respects editor.config properly. If you're editing recently created code, save, and see a bunch of
whitespace changes, you likely have something misconfigured.

## Getting Started Locally

Install packages:
`npm i`

To run against a local instance of the API (only works if you have the API running locally):
`npm run start-local`

Login in at http://localhost:4200/ with this username and password:

really-good@interviewee.com \
My@Great99Password
