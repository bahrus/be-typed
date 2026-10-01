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

The button's position and content, and the element inside the label that displays the chosen name, can be adjusted:

```html
<label be-typed be-typed-trigger-insert-position=afterbegin be-typed-label-text-container=b be-typed-button-content=✎><b>[Specify Name]</b></label>
```

## Programmatic attachment (no attribute)

The attribute syntax shines for server-rendered HTML and progressive enhancement, where the markup alone says what the enhancement does.  But most web development today renders on the client, with a framework (Lit, React, Vue, Svelte, etc.) that already has a JavaScript reference to each element it creates.  There, attaching be-typed programmatically is the better fit:

1. **A less clunky API.**  Frameworks are awkward about setting arbitrary attributes, let alone an emoji one like `⚙️`, or a family of them like `be-typed-label-text-container=b`.  Programmatically, that is just `{labelTextContainer: 'b'}`.
2. **Less stringifying and parsing.**  Settings go straight onto the enhancement as property values, rather than being written to attributes and read back.
3. **Less overhead monitoring attributes.**  The attribute approach relies on be-hive / mount-observer watching the DOM for elements that carry (or gain) the attribute.  `def.js` just registers the config.  The enhancement is attached exactly when, and to exactly the elements, your code says, and mount-observer is never loaded.

Either way it is the **same enhancement**, with the same defaults and the same dialog, so the two approaches can be mixed in one app: attributes for server-rendered islands, programmatic attachment inside client-rendered components.

### Registration

```JavaScript
import { defBeTyped } from 'be-typed/def.js';
const emc = await defBeTyped(document.body); // or a shadow root's host, for a scoped registry
```

### Attribute → property mapping

| Attribute                          | Property                | Default        |
|------------------------------------|-------------------------|----------------|
| `be-typed` (`⚙️`)                  | *(attachment itself)*   |                |
| `be-typed-trigger-insert-position` | `triggerInsertPosition` | `'beforeend'`  |
| `be-typed-label-text-container`    | `labelTextContainer`    | `'span'`       |
| `be-typed-button-content`          | `buttonContent`         | `'⚙️'`          |

`triggerInsertPosition` takes any [`InsertPosition`](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement#position) value.  `labelTextContainer` is a CSS selector, matched within the label.  As with the attribute path, a `button.be-typed-trigger` already in place is reused rather than a new one created.

### Declarative -- via `enh.set`

```JavaScript
// equivalent to <label be-typed be-typed-button-content=✎>
oLabel.enh.set.beTyped.buttonContent = '✎';
oLabel.enh.beTyped.labelTextContainer = 'b';
```

Only the first property needs to go through `.set` -- that is what attaches the enhancement.  This works before or after `defBeTyped` is called.  If it is called after, the enhancement is attached once the config is registered.

### Imperative -- via `enh.get()`

```JavaScript
Object.assign(oLabel.enh.get(emc), {
    buttonContent: '✎',
    triggerInsertPosition: 'afterbegin',
    labelTextContainer: 'b',
});
```

### Differences from the attribute path

- **Enhancement key.**  Programmatically, the instance is always at `el.enh.beTyped`.  With the emoji attribute it is at `el.enh['⚙️']`.

See [demo/Programmatic](demo/Programmatic/) for runnable examples.

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
