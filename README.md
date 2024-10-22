## Clone and install dependencies
```
git clone git@github.com:juan-fernandez/iitm-issue-repro.git
cd iitm-issue-repro
npm install
```

### Versions

* `Node.js@v20.17.0`
* `npm@10.8.2`

## Without IITM
Run script without iitm:
```
npm run fail:spread-on-export
```

It should simply print `dependency`:
```
> iitm-issue-repro@1.0.0 pass:spread-and-export
> node ./pass-spread-and-export.mjs

dependency
```

## With IITM
Run the same script with iitm:
```
NODE_OPTIONS='--import ./loader.mjs' npm run fail:spread-on-export
```

It should fail with this message:
```
> iitm-issue-repro@1.0.0 fail:spread-on-export
> node ./fail-spread-on-export.mjs

node:internal/modules/esm/translators:129
  throw new ERR_INVALID_RETURN_PROPERTY_VALUE(
        ^

TypeError [ERR_INVALID_RETURN_PROPERTY_VALUE]: Expected string, array buffer, or typed array to be returned for the "source" from the "load" hook but got undefined.
    at assertBufferSource (node:internal/modules/esm/translators:129:9)
    at ModuleLoader.moduleStrategy (node:internal/modules/esm/translators:164:3)
    at callTranslator (node:internal/modules/esm/loader:428:14)
    at ModuleLoader.moduleProvider (node:internal/modules/esm/loader:434:30) {
  code: 'ERR_INVALID_RETURN_PROPERTY_VALUE'
}

Node.js v20.17.0
```

## Root cause analysis

The problem seems to be related with using the spread operator together with a package internal import `#dependency`: 

In `fail-spread-on-export/dependency.js`:
```javascript
// this does not work!
module.exports = {
    ...require('#dependency')
}
```

Strangely enough, this approach does **not** fail:

In `pass-spread-and-export/dependency.js`: 
```javascript
// this works
const dep = require('#dependency')

module.exports = {
    ...dep
}
```

As it can be seen if this script is run:

```
NODE_OPTIONS='--import ./loader.mjs' npm run pass:spread-and-export
```

## Base case

If you don't use a internal import it works:

```
NODE_OPTIONS='--import ./loader.mjs' npm run pass:no-internal-package
```

```javascript
// this works
module.exports = {
    ...require('../dependency')
}
```