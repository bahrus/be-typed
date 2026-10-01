# Add Support For Programmatic Attachment

## Bruce's Ask

Can you please follow the example of [be-persistent](https://github.com/bahrus/be-persistent) and [the addendum](../types/ImportantEnhancementAddendum.md) to add demos and adjust be-typed.js as needed and add def.js to support programmatic attachment of this enhancement?

Please add your implementation notes below.

## Implementation Notes

be-typed can now be attached with no attribute and no be-hive, via
`el.enh.set.beTyped` or `el.enh.get(emc)`. It follows be-persistent and
addendum steps 1–6. Step 7 (accept elements wherever an id is accepted)
doesn't apply: be-typed takes no ids. The approach matches be-clonable and
be-delible, done just before this one. See
[be-clonable's notes](../../be-clonable/Chats/AddSupportForProgrammaticAttachment.md).
be-typed needed more fixes than those two, listed below.

### What changed

| File | Change |
|------|--------|
| `def.js` (new) | `defBeTyped(ref)`, the formulaic copy of be-persistent's. |
| `be-typed.js` | `init` reads `ctx.emc \|\| ctx.config`, `await`s roundabout, then sets `initialized` (steps 1–2). |
| `emc.mjs` → `emc.json`, `⚙️.json` | `addTypeBtn` is now an action instead of a compact. `setBtnContent` also waits for `trigger`. Adds `propagate: ['labelTextContainer']`. (`enhKey` was already `beTyped`.) |
| `Typer.js` | The shared dialog now applies to the label that opened it (see 1 below). |
| `package.json` | Adds `assign-gingerly` to `dependencies`. `exports` now lists `./def.js`, `./emc.json`, `./⚙️.json` (and keeps `./⚙️.js`, which does exist). `files` now includes the two JSON files. |
| `types/be-typed/types.d.ts` | Adds `initialized?: boolean`. |
| `README.md` | New "Programmatic attachment (no attribute)" section (step 6). Also an attribute example for the three settings attributes. |
| `demo/Programmatic/` | `DeclarativeInSequence.html`, `DeclarativeOutOfSequence.html`, `Imperative.html`. |
| `tests/Programmatic*.{html,spec.mjs}` | One per pattern (step 5). |

### Bugs found and fixed

1. **With more than one be-typed label, Apply edited the wrong one.**
   *This affected the attribute path too, before any of this work.* The
   dialog is created once per page and shared. But its Apply listener closed
   over whichever `Typer` created it, i.e. the first label opened. So:
   - open label A's dialog and cancel;
   - open label B's dialog, enter a name, and apply;
   - **A** got the new input and name, not B.

   The same closure also kept A's element alive for the life of the page,
   even after removal. In a client-rendered app, where labels come and go,
   that is a leak.

   Fix: `showDialog()` records the opening `Typer` in a module-level
   `WeakRef` (`activeTyper`). The shared listeners call
   `activeTyper?.deref()?.applyDialog(e)`, and the close button just closes
   the dialog it belongs to. The listeners are no longer on the first
   `Typer`'s `AbortController`. With that controller, `dispose()` of the
   first `Typer` would have disabled Apply for every label. `dispose()` now
   just clears `activeTyper` if it's this `Typer`. (Nothing calls
   `dispose()` today.)

2. **The button was never added when `triggerInsertPosition` was set
   programmatically.** `addTypeBtn` was driven by the compact
   `when_triggerInsertPosition_changes_call_addTypeBtn`, which only fires on a
   *change*. Take `Object.assign(el.enh.get(emc), {triggerInsertPosition:
   'afterbegin'})`:
   - the value is assigned before roundabout finishes initializing;
   - roundabout correctly preserves it;
   - but it never goes through a setter, so no change event is raised, and
     no button appears.

   It is now an action, `addTypeBtn: {ifAllOf: ['triggerInsertPosition',
   'enhancedElement']}`, which is what be-clonable and be-delible already
   use. Actions are also evaluated at startup.
   **Possible addendum note:** a compact whose only job is to run a method
   once a setting is present can miss values set programmatically during
   init. Prefer an action.

3. **`setBtnContent` could run before the button existed.** Its `ifAllOf`
   was only `['buttonContent']`. When `buttonContent` arrived before
   `trigger`, as it does with `enh.set`, it threw `Cannot read properties of
   undefined (reading 'deref')`. The attribute path got lucky with the
   ordering. It now requires `trigger` too, like be-clonable and be-delible.

4. **`labelTextContainer` was unmonitored** (addendum step 4). Only
   `Typer.js` reads it, at Apply time, so no action references it. A value
   set right after `enh.get(emc)` was silently reset to `'span'`. Added to
   `propagate`.

5. **`package.json`:**
   - `def.js` imports assign-gingerly, but it wasn't a dependency. It only
     resolved, at 0.0.87, through be-hive.
   - `exports` listed a nonexistent `./emc.js`.
   - `files` left out `emc.json`, which `def.js` imports.

be-typed doesn't have the roundabout `dispatch`-compact console error that
be-clonable and be-delible had, because it never used that compact.

### Flagged, not changed: `nudge`

`withAttrs` has `_nudge: {instanceOf: 'Boolean'}`, and `EndUserProps` has
`nudge?: boolean`. Nothing reads `nudge`, now or in the legacy code, and
`nudge` is one of roundabout's reserved names (addendum step 4). It's
harmless as long as nothing uses it. If it's not planned for anything, I'd
suggest removing both. If it is planned, it needs `propagate: ['nudge']`,
as be-persistent has, or better, a different name.

### Tests

The three new specs follow be-persistent's fixtures. They load only
`def.js`: no attribute, no be-hive. Each fixture attaches be-typed to **two**
labels, and each spec:
- checks both buttons, with custom content and in the expected position;
- opens the dialog from label a and cancels, then opens it from label b,
  sets a name and type, and applies;
- checks that **b**, and not a, got the typed, named input and the updated
  label text. In the imperative test, that text lands in `labelTextContainer:
  'b'` rather than the default `span`;
- asserts no console errors;
- asserts mount-observer was never requested.

`test1.spec.mjs` (the attribute path) now also asserts no console errors.

Negative controls. Each fix was temporarily reverted, and its test failed
for the expected reason:

| Reverted | Result |
|----------|--------|
| `Typer.js` restored from HEAD (fix 1) | All 3 fail: b's input never gets `type="number"`. The edit went to a. |
| `addTypeBtn` back to a compact (fix 2) | Imperative fails: no button |
| `setBtnContent` without `trigger` (fix 3) | 2 fail on the `deref` TypeError |
| `labelTextContainer` not propagated (fix 4) | Imperative fails: label text not updated |
| `ctx.config` fallback removed | All 3 fail: no button |

Final run: **4 passed**, and 20/20 with `--repeat-each 5`. Also checked in
the browser:
- the three demo pages: button, dialog, and apply all work, with no errors;
- the new README attribute example, alongside a plain `be-typed` label: each
  gets exactly one button, and Apply edits the right label. So the
  compact→action change didn't double up buttons on the attribute path.

### Other things to know

- `npm install` updated `package-lock.json`, for the new dependency.
- `git status` shows the `legacy/` files as deleted. That was already the
  case before this change; I didn't touch them.
- The `types.d.ts` change is in this clone of the `types` submodule. It
  needs committing / pushing from there.

