# be-typed (⚙️)

Allow the user to customize input element during run time.

[![Playwright Tests](https://github.com/bahrus/be-typed/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-typed/actions/workflows/CI.yml)
[![NPM version](https://badge.fury.io/js/be-typed.png)](http://badge.fury.io/js/be-typed)
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-typed?style=for-the-badge)](https://bundlephobia.com/result?p=be-typed)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-typed?compression=gzip">

## Markup:

```html
<label  be-typed><span>[Specify Name]</span></label>
```

or

```html
<label  ⚙️><span>[Specify Name]</span></label>
```

- [x] Adds edit button inside label.
- [x] Edit button opens dialog that allows user to select type of input (boolean, number, etc).
- [x] Can also specify validation attributes
- [x] Dialog also supports selecting name of input element.
- [x] Be able to specify :name for [be-reformable](https://github.com/bahrus/be-reformable), so it becomes part of path or header

## Viewing Locally

Any web server that serves static files with server-side includes will do but...

1. Install git
2. Fork/clone this repo
3. Install node.js
4. Open command window to folder where you cloned this repo
5. > git submodule add https://github.com/bahrus/types.git types
6. > git submodule update --init --recursive
7. > npm install
8. > npm run serve
9. Open http://localhost:8000/demo/ in a modern browser

## Running Tests

```
> npm run test
```

## Using from CDN:

```html
<script type=module crossorigin=anonymous>
    import 'https://esm.run/be-typed';
</script>
```

## Referencing via ESM Modules:

```JavaScript
import 'be-typed/be-typed.js';
```
