class Modal {
	constructor(elem, displayStyle, width, height, options) {
		options = options || {}
		this.autoClose = options.autoClose || false // autoClose = true enables modal close on Escape press and outside click
		this.beforeOpen = options.beforeOpen // beforeOpen() is called with the content element everytime open() is called

		this.bg = this._makeCover()
		this.bg.style.backgroundColor = "black"
		this.bg.style.opacity = "0.5"

		this.fg = this._makeCover()
		this.fg.style.backgroundColor = "transparent"

		if (this.autoClose) {
			this.fg.onmousedown = (evt)=>{
				if (evt.target===this.fg) this.close()
			}
		}

		this.container = this._makeCover()
		this.container.style.height = height
		this.container.style.width = width
		this.container.style.position = "relative"
		this.container.style.borderRadius = options.borderRadius || "5px"
		this.container.style.backgroundColor = "white"
		this.container.style.color = "#0d0d0d"
		this.container.style.boxShadow = "0 4px 8px 0 rgba(0,0,0,0.4)"
		this.container.style.marginRight = "20px"
		this.container.style.marginLeft = "20px"
		// this.container.style.overflowY = "scroll"

		this.fg.appendChild(this.container)

		this.content = elem // save the content element
		this.content.remove() // remove it from DOM
		this.content.style.display = displayStyle // set display style of content

		this._escapePressed = this._escapePressed.bind(this)
	}

	_makeCloseBtn() {
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
		btn.style.top = "15px"
		btn.style.right = "25px"
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

	_makeCover() {
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

	cloneContent() {
		return this.content.cloneNode(true)
	}

	open(mod_elem) {
		let clone_elem = mod_elem || this.cloneContent() // clone content so that all input fields are reset
		if (this.beforeOpen) this.beforeOpen(clone_elem) // usually used to attach required events

		this.container.innerHTML = "" // clear container
		this.container.appendChild(this._makeCloseBtn())
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



class ModalConfirm extends Modal {
	constructor() {
		let elem = document.createElement("div")
		elem.style.width = "90%"
		elem.style.height = "50%"

		let ok = document.createElement("button")
		ok.id = "confirm-ok"
		ok.classList.add("btn", 'btn-primary')
		ok.style.position = "absolute"
		ok.style.bottom = "10%"
		ok.style.width = "30%"
		ok.style.right = "26%"
		ok.innerHTML = `Okay`

		let cancel = document.createElement("button")
		cancel.id = "confirm-cancel"
		cancel.classList.add("btn", 'btn-secondary')
		cancel.style.position = "absolute"
		cancel.style.bottom = "10%"
		cancel.style.width = "18%"
		cancel.style.right = "5%"
		cancel.innerHTML = `Cancel`

		elem.innerHTML += `<h6 id="confirm-msg"></h6>`
		elem.appendChild(ok)
		elem.appendChild(cancel)

		super(elem, "block", "550px", "180px", {autoClose: true})
	}

	open(msg, onokay, oncancel) {
		this.beforeOpen = (form)=>{
			form.querySelector("#confirm-msg").innerHTML = msg
			let ok_btn = form.querySelector("#confirm-ok")
			ok_btn.onclick = ()=>{
				ok_btn.classList.add('btn-warning')
				ok_btn.innerHTML = "Disabling ..."
				if (onokay) onokay()
			}
			form.querySelector("#confirm-cancel").onclick = ()=>{
				if (oncancel) oncancel()
				this.close()
			}
		}
		super.open()
	}
}


const modal_confirm = new ModalConfirm()
