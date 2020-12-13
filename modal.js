class Modal {
	constructor(elem, display_style, width, height, borderRadius) {
		borderRadius = borderRadius || "5px"

		this.bg = this._make_cover()
		this.bg.style.backgroundColor = "black"
		this.bg.style.opacity = "0.5"

		this.fg = this._make_cover()
		this.fg.style.backgroundColor = "transparent"

		this.fg.onmousedown = (evt)=>{
			if (evt.target===this.fg) this.close()
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


	open() {
		let clone_elem = this.content.cloneNode(true) // clone content so that any input fields are reset
		this.container.innerHTML = "" // clear container
		this.container.appendChild(clone_elem) // append the new clone

		document.body.appendChild(this.bg)
		document.body.appendChild(this.fg)
	}

	close() {
		this.bg.remove()
		this.fg.remove()
	}
}
