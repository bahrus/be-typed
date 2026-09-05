# Close Button

## Bruce's Ask

Currently, the unstyled modal dialog looks as follows:

![Modal Dialog](image.png)

Can you please place a fully styleable close button in the upper right corner of the dialog?

Please add your implementation notes below.

## Implementation Notes

All changes are in [`Typer.js`](../Typer.js).

### Markup

A single button is now the first child of the `<dialog>`, **outside** the
`<form method="dialog">` so it has no bearing on form semantics (default
submit button, Enter handling, `elements` collection):

```html
<button type="button" class="be-typed-close" aria-label="Close" title="Close">&#x2715;</button>
```

- `type="button"` – never submits.
- `aria-label` / `title` – "Close" (the visible glyph is `✕` = `U+2715`).
- Closing is wired in JS: a `click` listener calls `dialog.close('cancel')`,
  registered on the same `AbortController` signal as the existing Apply
  handler, so `dispose()` tears it down too. `returnValue` is `"cancel"`,
  matching the existing Cancel button.

### "Fully styleable" default look

`ensureStyle()` injects one `<style id="…-style">` into `document.head` the
first time the dialog is built. Everything is wrapped in
`@layer be-typed { … }`:

```css
@layer be-typed {
    dialog#<id> { position: relative; }
    dialog#<id> .be-typed-close {
        position: absolute;
        inset-block-start: 0.25rem;
        inset-inline-end: 0.25rem;
        inline-size: 1.75rem;
        block-size: 1.75rem;
        padding: 0;
        font: inherit;
        line-height: 1;
        color: inherit;
        background: none;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
    }
    dialog#<id> .be-typed-close:hover { background: rgba(0, 0, 0, 0.08); }
}
```

Why a cascade layer: any rule the page author writes for `.be-typed-close`
(or the dialog) **outside** a layer beats these, regardless of specificity
or source order. So the author can restyle, reposition, or fully hide
(`display: none`) the button with a plain `.be-typed-close { … }` rule and
no `!important`. Verified: an unlayered `.be-typed-close { background: crimson; … }`
page rule overrode the layered defaults while the layer's positioning still
applied.

The dialog only gets `position: relative` (needed as the offset parent for
the absolutely-positioned button); that too is layered and overridable.

### Gotcha: the dialog id

The dialog id (`guid`) contains `+` and `/`, which are CSS combinators /
invalid in a raw selector. The style block builds its selector with
`CSS.escape(guid)` — a plain `dialog#${guid}` silently matched nothing.

### Verification

- `npx playwright test` — still green.
- Manual (Chromium, `demo/dev.html`): button renders in the dialog's
  top-right corner; clicking it sets `dialog.open` from `true` to `false`.