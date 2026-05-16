# Modals!!
## lib-modaljs

A lightweight, dependency-free vanilla JavaScript library to create highly customizable modal overlays, slide-out side drawers, native dialog overrides (alert, confirm, prompt), and transient toast notifications.

## Features

- 🚀 **Zero Dependencies**: Pure vanilla JavaScript.
- 📐 **Multiple Layouts**: Supports centered modals and multi-directional slide-out drawers (Top, Bottom, Left, Right).
- 🛎️ **Native Overrides**: Clean asynchronous replacements for `alert()`, `confirm()`, and `prompt()`.
- 🍞 **Toast Notifications**: Non-blocking auto-dismissing notifications with custom screen-corner placement.
- 🎨 **Flexible Styling**: Built-in support for custom transitions, dimensions, overlay fades, and style overrides.

---

## Installation

Include the library directly into your HTML document via standard script tagging:

```html
<script src="path/to/lib-modal.js"></script>
```

Use this repository as cdn

```html
<script src="https://cdn.jsdelivr.net/gh/shashfrankenstien/lib-modaljs/lib-modal.js"></script>
```
```html
<script src="https://cdn.jsdelivr.net/gh/shashfrankenstien/lib-modaljs@v0.3.0/lib-modal.js"></script>
```

Try the minified version
```html
<script src="https://cdn.jsdelivr.net/gh/shashfrankenstien/lib-modaljs/lib-modal.min.js"></script>
```
```html
<script src="https://cdn.jsdelivr.net/gh/shashfrankenstien/lib-modaljs@v0.3.0/lib-modal.min.js"></script>
```


---

## Usage Guide

### 1. Standard Modal Overlays
Define your modal payload content structure anywhere inside your HTML layout:

```html
<div id="my-modal-content" style="display: none;">
    <h2>Welcome to lib-modaljs</h2>
    <p>This content is dynamically extracted, cloned, and rendered.</p>
</div>
```

Instantiate and display your custom configured wrapper through JavaScript:

```javascript
const contentElem = document.getElementById('my-modal-content');

// Instantiate configuration options
const basicModal = new Modal(contentElem, {
  autoClose: true,       // Clicking overlay or pressing ESC closes it
  width: '500px',        // Explicit boundary width dimension
  beforeOpen: (clone) => {
    console.log("Preparing layout element content:", clone);
  }
});

// Display the modal viewport window
basicModal.open();
```

### 2. Multi-Directional Side Drawers
Slide structural dashboard frames or navigational menus from any edge viewport boundary (`ModalDrawerLeft`, `ModalDrawerRight`, `ModalDrawerTop`, `ModalDrawerBottom`):

```javascript
const navMenu = document.getElementById('mobile-navigation');

const sideDrawer = new ModalDrawerLeft(navMenu, {
  width: '300px',
  autoClose: true
});

// Trigger slide animation out from the left screen boundary margin
sideDrawer.open();
```

### 3. Asynchronous Pre-instantiated Dialogs
The library automatically instantiates global window overlays (`modal_alert`, `modal_confirm`, `modal_prompt`, and `modal_toast`) for quick access.

#### Alert Interactor
```javascript
modal_alert.open("Action execution failed successfully!", () => {
  console.log("User dismissed alert box overlay window.");
});
```

#### Multi-Choice Confirm View
```javascript
modal_confirm.open(
  "Are you sure you want to drop the database tables?",
  () => { console.log("User confirmed destructive operation execution."); },
  () => { console.log("User aborted dangerous operational logic flow."); }
);
```

#### Data-Entry Form Prompts
```javascript
modal_prompt.open(
  "Please insert authentication API developer access key parameter:",
  "DEFAULT_TOKEN_XYZ",
  (inputValue) => { console.log(`Configured key securely fetched: ${inputValue}`); },
  () => { console.warn("Operation interface prompt closed by user."); }
);
```

#### Transient Toast Notifications
```javascript
modal_toast.open("File upload completed successfully!", {
  placement: "right-bottom", // Options: "right-top", "right-bottom", "left-top", "left-bottom"
  timeout: 3500,             // Closes itself out after 3.5 seconds
  icon: "/assets/check.png"  // Optional brand logo thumbnail asset mapping
});
```

---

## Configuration Options (`options`)

The core `Modal` constructor and its child extensions take a custom `options` object as their optional second argument:


| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `displayStyle` | `string` | `block` | Display style of modal content when shown (e.g. `'block'`, `'flex'`, `'grid'`). |
| `height` | `string` | - | Directly maps targeted fixed CSS boundary value layout heights (e.g. `'250px'`). |
| `width` | `string` | - | Directly maps targeted fixed CSS boundary value layout widths (e.g. `'400px'`, `'60%'`). |
| `autoClose` | `boolean` | `false` | If true, user can press Escape key or click out on background to close. |
| `noCloseBtn` | `boolean` | `false` | Omits rendering standard close boundary cross markup (`×`) button overlay block. |
| `noTransition`| `boolean` | `false` | Disables sliding/fading dimensional geometric animation delays entirely. |
| `noFade` | `boolean` | `false` | Keeps ambient blur layer background mask completely see-through transparent. |
| `transitionStartPos` | `Object` | `{top: '10%'}` | Start position of transition
| `classList` | `string[]` | `[]` | Appends custom CSS classes arrays directly onto the container element. |
| `css` | `Object` | `{ position: "relative", borderRadius: "4px", backgroundColor: "white", color: "#0d0d0d", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.4)", marginRight: "20px", marginLeft: "20px" }` | Key-value mapping of js styles applied natively to the generated outer dialog container. |
| `beforeOpen` | `Function`| `undefined` | callback runs right before opening. Receives the cloned element node. |
| `afterClose` | `Function`| `undefined` | callback triggered immediately after component destruction. |


---

## License

This software utility code is distributed under standard licensing terms found inside active open source package structures. Check the project repository root coordinates for full authorization parameters details.

---

# Example

[lib-modaljs](https://shashfrankenstien.github.io/lib-modaljs/)

