# be-typed

Allow the user to customize input element during run time.

[![Playwright Tests](https://github.com/bahrus/be-typed/actions/workflows/CI.yml/badge.svg?branch=baseline)](https://github.com/bahrus/be-typed/actions/workflows/CI.yml)
<a href="https://nodei.co/npm/be-typed/"><img src="https://nodei.co/npm/be-typed.png"></a>
[![How big is this package in your project?](https://img.shields.io/bundlephobia/minzip/be-typed?style=for-the-badge)](https://bundlephobia.com/result?p=be-typed)
<img src="http://img.badgesize.io/https://cdn.jsdelivr.net/npm/be-typed?compression=gzip">

Markup:

```html
<label  be-typed><span>[Specify Name]</span></label>
```

[x]: Adds edit button inside label.
[x]: Edit button opens dialog that allows user to select type of input (boolean, number, etc).
[x]: Can also specify validation attributes
[x]: Some attributes related to be-reformable can also optionally be edited.
[x]: Dialog also supports selecting name of input element.

## Viewing this element locally

Any web server than can serve static files will do, but...

1.  Install git.
2.  Fork/clone this repo.
3.  Install node.
4.  Open command window to folder where you cloned this repo.
5.  > npm install
6.  > npm run serve
7.  Open http://localhost:3030/demo/dev in a modern browser.

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
import 'be-lazy/be-typed.js';
```