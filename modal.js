class Modal {
	constructor(elem, display_style, width, height, options) {
		options = options || {}
		let borderRadius = options.borderRadius || "5px"
		this.autoClose = options.autoClose || false // autoClose = true enables modal close on Escape press and outside click

		this.bg = this._make_cover()
		this.bg.style.backgroundColor = "black"
		this.bg.style.opacity = "0.5"

		this.fg = this._make_cover()
		this.fg.style.backgroundColor = "transparent"

		if (this.autoClose) {
			this.fg.onmousedown = (evt)=>{
				if (evt.target===this.fg) this.close()
			}
		}

		this.container = this._make_cover()
		this.container.style.height = height
		this.container.style.width = width
		this.container.style.position = "relative"
		this.container.style.borderRadius = borderRadius
		this.container.style.backgroundColor = "white"
		this.container.style.boxShadow = "0 4px 8px 0 rgba(0,0,0,0.4)"
		// this.container.style.overflowY = "scroll"

		this.fg.appendChild(this.container)

		this.content = elem // save the content element
		this.content.remove() // remove it from DOM
		this.content.style.display = display_style // set display style

		this._escapePressed = this._escapePressed.bind(this)
	}

	_make_close_btn() {
		let btn = document.createElement("span")
		btn.innerHTML = "&times;"
		btn.id="close"
		btn.onclick = ()=>{
			this.close()
		}
		btn.style.position = "absolute"
		btn.style.display = "flex"
		btn.style.justifyContent = "center"
		btn.style.alignItems = "center"
		btn.style.top = "20px"
		btn.style.right = "20px"
		btn.style.width = "40px"
		btn.style.height = "40px"
		btn.style.borderRadius = "20px"
		btn.style.cursor = "pointer"

		btn.style.background = "#e3e3e3"
		btn.style.opacity = "0.8"
		btn.style.fontSize = "20px"
		btn.style.fontWeight = "1000"
		btn.style.zIndex = '110'
		return btn
	}

	_make_cover() {
		let cover = document.createElement("div")
		cover.style.position = 'fixed'
		cover.style.height = '100%'
		cover.style.width = '100%'
		cover.style.top = '0'
		cover.style.bottom = '0'
		cover.style.right = '0'
		cover.style.left = '0'
		cover.style.zIndex = '100'
		cover.style.display = 'flex'
		cover.style.justifyContent = 'center'
		cover.style.alignItems = 'center'
		cover.style.overflow = 'hidden'
		return cover
	}

	_escapePressed(evt) {
		if (evt.key === "Escape") { // escape key maps to keycode `27`
			this.close()
		}
	}

	open() {
		let clone_elem = this.content.cloneNode(true) // clone content so that any input fields are reset
		this.container.innerHTML = "" // clear container
		this.container.appendChild(this._make_close_btn())
		this.container.appendChild(clone_elem) // append the new clone

		document.body.appendChild(this.bg)
		document.body.appendChild(this.fg)

		if (this.autoClose) {
			document.body.addEventListener('keyup', this._escapePressed)
		}
	}

	close() {
		if (this.autoClose) {
			document.body.removeEventListener('keyup', this._escapePressed)
		}
		this.bg.remove()
		this.fg.remove()
	}
}
