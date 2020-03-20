# rona (inspired by covid-19 😈)

[![Build Status](https://travis-ci.com/knowbee/rona.svg?token=yN9jXnk59suszMqNsJJb&branch=master)](https://travis-ci.com/knowbee/rona)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

Suppose you have a project or multiple projects that you've been working on for like a year with ("old fashioned" require syntax) then all of a sudden you decide to adopt this new ES6 syntax("cool" import syntax), but how are you gonna be able to convert every line out of 100 files 😭 to adopt this new style 🤔? well **rona** got your back 😉

### Currently supported conversions

```js
const something = require("example"); // => import something from "example";
const Ben = require("person").name; // => import { name } from "person";
```

### Installation

```
npm install -g rona
```

```
yarn global add rona
```

## Usage

::

    Usage: rona [options]

    rona is a tool that converts your project require syntax to ES6 import syntax as it should be

    Options:

      --version,  -V            output the version number
      --path,     -p            provide a path to run rona
      -h,         --help        output usage information

    Example:
      rona --path ./src

## Contribution

- Please before making a PR, read first this [Contributing Guideline](./CONTRIBUTING.md)

## License

MIT

## Author

Igwaneza Bruce

<knowbeeinc@gmail.com>
