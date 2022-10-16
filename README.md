# Modals!!

Use this repository as cdn

```html
<script src="https://cdn.jsdelivr.net/gh/shashfrankenstien/lib-modaljs/lib-modal.js"></script>
```
```html
<script src="https://cdn.jsdelivr.net/gh/shashfrankenstien/lib-modaljs@v0.2.1/lib-modal.js"></script>
```

Try the minified version
```html
<script src="https://cdn.jsdelivr.net/gh/shashfrankenstien/lib-modaljs/lib-modal.min.js"></script>
```
```html
<script src="https://cdn.jsdelivr.net/gh/shashfrankenstien/lib-modaljs@v0.2.1/lib-modal.min.js"></script>
```

# Usage
```html
<div id="test" style="display:none;">
    Hello! <h1>Test!</h1>
</div>

<script>
    const modal_example = new Modal(document.getElementById("test"), {
        height: "200px",
        width: "300px",
    })

    modal_example.open()
</script>

```

# Options

Option | type | default | Purpose
-------|------|---------|----------
displayStyle | String | `block` | Display style of modal content when shown
width | String | - | Width of the modal
height | String | - | Height of the modal
autoClose | Boolean | `false` | Auto close when clicked outside the modal or when Esc is pressed
noCloseBtn | Boolean | `false` | Don't show close button on top right
noTransition | Boolean | `false` | Disable modal animated transition
noFade | Boolean | `false` | Don't fade background
transitionStartPos | Object | `{top: '10%'}` | Start position of transition
classList | Array | `[]`| CSS classes to add to modal container
css | Object | `{ position: "relative", borderRadius: "4px", backgroundColor: "white", color: "#0d0d0d", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.4)", marginRight: "20px", marginLeft: "20px" }`| Inline CSS to apply to modal container
beforeOpen | function | `undefined` | function called with modal content before open
afterClose | function | `undefined` | function called after close


# Example

[lib-modaljs](https://shashfrankenstien.github.io/lib-modaljs/)
