class Modal {
	constructor(elem, displayStyle, width, height, options) {
		options = options || {}
		this.autoClose = options.autoClose || false // autoClose = true enables modal close on Escape press and outside click
		this.noCloseBtn = options.noCloseBtn || false // Don't display close button on top right
		this.beforeOpen = options.beforeOpen // beforeOpen() is called with the content element everytime open() is called

		this.bg = this._makeCover()
		this.bg.style.backgroundColor = "black"

		this.fg = this._makeCover()
		this.fg.style.backgroundColor = "transparent"

		// set up trnsition timing
		this.bg.style.transition = "all 0.1s ease"
		this.fg.style.transition = "all 0.2s ease"
		this._resetTransition()

		if (this.autoClose) {
			this.fg.onmousedown = (evt)=>{
				if (evt.target===this.fg) this.close()
			}
		}

		this.container = this._makeCover()
		this.container.style.height = height
		this.container.style.width = width
		this.container.style.position = "relative"
		this.container.style.borderRadius = options.borderRadius || "4px"
		this.container.style.backgroundColor = "white"
		this.container.style.color = "#0d0d0d"
		this.container.style.boxShadow = "0 4px 8px 0 rgba(0,0,0,0.4)"
		this.container.style.marginRight = options.marginRight || "20px"
		this.container.style.marginLeft = options.marginLeft || "20px"
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

	_resetTransition() {
		// set values to closed state
		this.bg.style.opacity = "0"
		this.fg.style.opacity = "0"
		this.fg.style.height = "120%"
	}

	_performTransition() {
		// set values to open state
		this.bg.style.opacity = "0.5"
		this.fg.style.opacity = "1"
		this.fg.style.height = "100%"
	}

	_escapePressed(evt) {
		if (evt.key === "Escape") { // escape key maps to keycode `27`
			this.close()
		}
	}

	cloneContent() {
		return this.content.cloneNode(true)
	}

	async open(mod_elem) {
		let clone_elem = mod_elem || this.cloneContent() // clone content so that all input fields are reset
		if (this.beforeOpen) this.beforeOpen(clone_elem) // usually used to attach required events

		this.container.innerHTML = "" // clear container
		if (!this.noCloseBtn) this.container.appendChild(this._makeCloseBtn())
		this.container.appendChild(clone_elem) // append the new clone

		document.body.appendChild(this.bg)
		document.body.appendChild(this.fg)
		// perform transition after a short timeout so that browser performs 'reflow'
		// see this answer: https://stackoverflow.com/a/24195559/5712554
		setTimeout(()=>{this._performTransition()}, 100)

		if (this.autoClose) {
			document.body.addEventListener('keyup', this._escapePressed)
		}
		return clone_elem
	}

	close() {
		if (this.autoClose) {
			document.body.removeEventListener('keyup', this._escapePressed)
		}
		this._resetTransition()
		setTimeout(()=>{ // provide time to reset transition (this performs reverse transition)
			this.bg.remove()
			this.fg.remove()
		}, 200)

	}
}


class ModalAlert extends Modal {
	constructor() {
		let elem = document.createElement("div")
		elem.style.width = "80%"
		elem.style.height = "40%"

		let ok = document.createElement("button")
		ok.id = "modal-alert-ok"
		ok.classList.add("btn", 'btn-primary')
		ok.style.position = "absolute"
		ok.style.bottom = "10%"
		ok.style.width = "30%"
		ok.style.right = "5%"
		ok.innerHTML = `Okay`

		elem.innerHTML += `<snap id="modal-alert-msg"></snap>`
		elem.appendChild(ok)

		super(elem, "block", "600px", "180px", {autoClose: true, noCloseBtn:true})
	}

	open(msg, onokay) {
		this.beforeOpen = (form)=>{
			form.querySelector("#modal-alert-msg").innerHTML = msg
			form.querySelector("#modal-alert-ok").onclick = ()=>{
				if (onokay) onokay(form)
				this.close()
			}
		}
		super.open()
	}
}


class ModalConfirm extends Modal {
	constructor() {
		let elem = document.createElement("div")
		elem.style.width = "80%"
		elem.style.height = "40%"

		let ok = document.createElement("button")
		ok.id = "modal-confirm-ok"
		ok.classList.add("btn", 'btn-primary')
		ok.style.position = "absolute"
		ok.style.bottom = "10%"
		ok.style.width = "30%"
		ok.style.right = "26%"
		ok.innerHTML = `Okay`

		let cancel = document.createElement("button")
		cancel.id = "modal-confirm-cancel"
		cancel.classList.add("btn", 'btn-secondary')
		cancel.style.position = "absolute"
		cancel.style.bottom = "10%"
		cancel.style.width = "18%"
		cancel.style.right = "5%"
		cancel.innerHTML = `Cancel`

		elem.innerHTML += `<span id="modal-confirm-msg"></span>`
		elem.appendChild(ok)
		elem.appendChild(cancel)

		super(elem, "block", "600px", "180px", {autoClose: true, noCloseBtn:true})
	}

	open(msg, onokay, oncancel) {
		this.beforeOpen = (form)=>{
			form.querySelector("#modal-confirm-msg").innerHTML = msg
			form.querySelector("#modal-confirm-ok").onclick = ()=>{
				if (onokay) onokay(form)
				this.close()
			}
			form.querySelector("#modal-confirm-cancel").onclick = ()=>{
				if (oncancel) oncancel(form)
				this.close()
			}
		}
		super.open()
	}
}


const modal_alert = new ModalAlert()
const modal_confirm = new ModalConfirm()
