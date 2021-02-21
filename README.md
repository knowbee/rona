# rona

[![Build Status](https://travis-ci.com/knowbee/rona.svg?token=yN9jXnk59suszMqNsJJb&branch=master)](https://travis-ci.com/knowbee/rona)
[![npm](https://img.shields.io/npm/dt/rona.svg)](https://www.npmjs.com/package/rona)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)
[![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

    convert require syntax to ES6 import syntax

## Currently supported conversions

```js
const something = require("example"); // => import something from "example";
const Ben = require("person").name; // => import { name as Ben } from "person";
const { something } = require("things"); // => import { something } from "things";
const { something, anotherThing } = require("things"); // => import { something, anotherThing } from "things";
const something = require("things")(); // => import something from "things";
require("things"); // => import "things";
require("../things"); // => import "../things";
const something = require("things").something(); // => import { something } from "things";
const { thing, thingy: anotherThing } = require("module"); // => import { thing, thingy as anotherThing} from "module"
```

#### Multiline syntax currently not supported

## Installation

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
