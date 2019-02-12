<p align="center">
	<img src="https://raw.githubusercontent.com/intelligo-systems/intelligo/master/.github/intelligo-logo.png" width="200"/>
<br>
	<b>🛠️ Command line tool for Intelligo :robot: Framework</b>
</p>
<p align="center">
   <a href="https://www.npmjs.com/package/intelligo-cli">
      <img alt="npm downloads" src="https://img.shields.io/npm/dt/intelligo-cli.svg?style=flat-square">
    </a>
    <a href="https://www.npmjs.com/package/intelligo-cli">
        <img alt="undefined" src="https://img.shields.io/npm/v/intelligo-cli.svg?style=flat-square">
        </a>
    <a href="https://github.com/tortuvshin/">
        <img src="https://img.shields.io/github/followers/tortuvshin.svg?style=social&label=Follow"
            alt="Followers"></a>
    <a href="https://github.com/intelligo-systems/intelligo/blob/master/LICENSE">
            <img alt="License" src="https://img.shields.io/github/license/intelligo-systems/intelligo-cli.svg?colorB=blue&style=flat-square">
           </a>
      <a href="https://twitter.com/intent/tweet?text=Wow:&url=https://github.com/intelligo-systems/intelligo">
     <img alt="Tweet" src="https://img.shields.io/twitter/url/http/shields.io.svg?style=social">
     </a>

</p>

🛠️ Command line tool for Intelligo Framework

## Installation

[![NPM](https://nodei.co/npm/intelligo-cli.png?compact=true)](https://nodei.co/npm/intelligo-cli/)

## Quick Start

Create the your bot project:

```js
$ intelligo mybot && cd mybot
```

Set the values in `config/default.json` before running the bot. Using your Facebook Page's / App's `ACCESS_TOKEN`, `VERIFY_TOKEN` and `APP_SECRET`

`ACCESS_TOKEN:` A page access token for your app, found under App -> Products -> Messenger -> Settings -> Token Generation

`VERIFY_TOKEN:` A token that verifies your webhook is being called. Can be any value, but needs to match the value in App -> Products -> Webhooks -> Edit Subscription

`APP_SECRET:` A app secret for your app, found under App -> Settings -> Basic -> App Secret -> Show

**Note:** If you don't know how to get these tokens, take a look at Facebook's [Quick Start Guide](https://developers.facebook.com/docs/messenger-platform/guides/quick-start) .

Install dependencies:

```js
$ npm install
```

Start your bot server:

```js
$ npm start
```

## License

> Copyright (C) 2019 Intelligo Systems.  
> Intelligo framework is open-sourced software licensed under the [MIT](https://opensource.org/licenses/MIT) license.  
> (See the [LICENSE](https://github.com/intelligo-systems/intelligo/blob/master/LICENSE) file for the whole license text.)
