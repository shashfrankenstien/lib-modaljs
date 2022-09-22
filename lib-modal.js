/*
*
MIT License

Copyright (c) 2021 Shashank Gopikrishna

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
**/


class Modal {
	constructor(elem, options) {
		options = options || {}
		this.autoClose = options.autoClose || false // autoClose = true enables modal close on Escape press and outside click
		this.noCloseBtn = options.noCloseBtn || false // Don't display close button on top right
		this.beforeOpen = options.beforeOpen // beforeOpen() is called with the content element everytime open() is called
		this.afterClose = options.afterClose // afterClose() is called with no args everytime close() is called
		this.noTransition = options.noTransition || false // noTransition = true disables modal transition

		this.bg = this._makeCover()
		this.bg.style.backgroundColor = (options.noFade) ? "transparent" : "black"

		this.fg = this._makeCover()
		this.fg.style.backgroundColor = "transparent"

		// set up trnsition timing
		this.transitionStartPos = {}
		if (!this.noTransition) { // setup transitions
			this.transitionStartPos = options.transitionStartPos || {top: '10%'}
			this.bg.style.transition = "all 0.1s ease"
			this.fg.style.transition = "all 0.15s ease"
		}
		this._resetTransition()

		if (this.autoClose) {
			this.fg.onmousedown = (evt)=>{
				if (evt.target===this.fg) this.close()
			}
		}

		this.container = this._makeCover()
		this.container.style.height = options.height
		this.container.style.width = options.width
		this.container.style.position = "relative"
		this.container.style.borderRadius = options.borderRadius || "4px"
		this.container.style.backgroundColor = options.containerColor || "white"
		this.container.style.color = "#0d0d0d"
		this.container.style.boxShadow = "0 4px 8px 0 rgba(0,0,0,0.4)"
		this.container.style.marginRight = options.marginRight || "20px"
		this.container.style.marginLeft = options.marginLeft || "20px"
		// this.container.style.overflowY = "scroll"

		this.fg.appendChild(this.container)

		this.content = elem // save the content element
		this.content.remove() // remove it from DOM
		this.content.style.display = options.displayStyle || "block" // set display style of content

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
		for (const direction in this.transitionStartPos) {
			this.fg.style[direction] = this.transitionStartPos[direction]
		}
	}

	_performTransition() {
		// set values to open state
		this.bg.style.opacity = "0.5"
		this.fg.style.opacity = "1"
		this.fg.style.top = "0px"
		this.fg.style.bottom = "0px"
		this.fg.style.right = "0px"
		this.fg.style.left = "0px"
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

		if (!this.noTransition) { // setup transitions
			// perform transition after a short timeout so that browser performs 'reflow'
			// see this answer: https://stackoverflow.com/a/24195559/5712554
			setTimeout(()=>{this._performTransition()}, 100)
		} else {
			this._performTransition()
		}

		if (this.autoClose) {
			document.body.addEventListener('keyup', this._escapePressed)
		}
		return clone_elem
	}

	close() {
		if (this.autoClose) {
			document.body.removeEventListener('keyup', this._escapePressed)
		}
		const exitFunc = ()=>{ // provide time to reset transition (this performs reverse transition)
			this.bg.remove()
			this.fg.remove()
			if (this.afterClose) this.afterClose()
		}
		if (!this.noTransition) { // setup transitions
			this._resetTransition()
			setTimeout(exitFunc, 200) // wait for 250ms since longest transitions is 200ms (0.2s)
		} else {
			exitFunc()
		}
	}
}


class _ModalDrawerBase extends Modal {
	constructor(elem, options) {
		super(elem, options)
		options = options || {}
		this.container.style.borderRadius = options.borderRadius || "0px"
		this.container.style.marginRight = options.marginRight || "0px"
		this.container.style.marginLeft = options.marginLeft || "0px"
	}
}

class ModalDrawerHorizontal extends _ModalDrawerBase {
	constructor(elem, options) {
		let transSign = (options.side==='bottom') ? '': '-' // negative or positive sign for 'top' value
		options.transitionStartPos = {top: transSign + options.height}
		options.width = "100%"
		super(elem, options)
		this.fg.style.flexDirection = 'column'
		this.fg.style.justifyContent = (options.side==='bottom') ? 'flex-end' : 'flex-start'
	}
}


class ModalDrawerVertical extends _ModalDrawerBase {
	constructor(elem, options) {
		let transSign = (options.side==='right') ? '': '-' // negative or positive sign for 'left' value
		options.transitionStartPos = {left: transSign + options.width}
		options.height = "100%"
		super(elem, options)
		this.fg.style.flexDirection = 'row'
		this.fg.style.justifyContent = (options.side==='right') ? 'flex-end' : 'flex-start'
	}
}


class ModalDrawerTop extends ModalDrawerHorizontal {
	constructor(elem, options) {
		options.side = 'top'
		super(elem, options)
	}
}

class ModalDrawerBottom extends ModalDrawerHorizontal {
	constructor(elem, options) {
		options.side = 'bottom'
		super(elem, options)
	}
}


class ModalDrawerRight extends ModalDrawerVertical {
	constructor(elem, options) {
		options.side = 'right'
		super(elem, options)
	}
}

class ModalDrawerLeft extends ModalDrawerVertical {
	constructor(elem, options) {
		options.side = 'left'
		super(elem, options)
	}
}






class ModalAlert extends Modal {
	constructor(width, height) {
		let elem = document.createElement("div")
		elem.style.width = "80%"
		elem.style.height = "40%"

		let ok = document.createElement("button")
		ok.id = "modal-alert-ok"
		ok.classList.add("btn", 'btn-primary')
		ok.style.position = "absolute"
		ok.style.bottom = "10%"
		ok.style.height = "20%"
		ok.style.width = "30%"
		ok.style.right = "5%"
		ok.style.cursor = "pointer"
		ok.innerHTML = `Okay`

		elem.innerHTML += `<span id="modal-alert-msg"></span>`
		elem.appendChild(ok)

		super(elem, {
			autoClose: true, noCloseBtn:true,
			width: width || "600px", height: height || "180px",
		})
	}

	open(msg, onokay) {
		super.open().then((form)=>{
			form.querySelector("#modal-alert-msg").innerHTML = msg
			let okbtn = form.querySelector("#modal-alert-ok")
			okbtn.onclick = ()=>{
				if (onokay) onokay(form)
				this.close()
			}
			okbtn.focus()
		})
	}
}


class ModalConfirm extends Modal {
	constructor(width, height) {
		let elem = document.createElement("div")
		elem.style.width = "80%"
		elem.style.height = "40%"

		let ok = document.createElement("button")
		ok.id = "modal-confirm-ok"
		ok.classList.add("btn", 'btn-primary')
		ok.style.position = "absolute"
		ok.style.bottom = "10%"
		ok.style.height = "20%"
		ok.style.width = "30%"
		ok.style.right = "26%"
		ok.style.cursor = "pointer"
		ok.innerHTML = `Okay`

		let cancel = document.createElement("button")
		cancel.id = "modal-confirm-cancel"
		cancel.classList.add("btn", 'btn-secondary')
		cancel.style.position = "absolute"
		cancel.style.bottom = "10%"
		cancel.style.height = "20%"
		cancel.style.width = "18%"
		cancel.style.right = "5%"
		cancel.style.cursor = "pointer"
		cancel.innerHTML = `Cancel`

		elem.innerHTML += `<span id="modal-confirm-msg"></span>`
		elem.appendChild(ok)
		elem.appendChild(cancel)

		super(elem, {
			autoClose: true, noCloseBtn:true,
			width: width || "600px", height: height || "180px",
		})
	}

	open(msg, onokay, oncancel) {
		super.open().then((form)=>{
			form.querySelector("#modal-confirm-msg").innerHTML = msg
			let okbtn = form.querySelector("#modal-confirm-ok")
			okbtn.onclick = ()=>{
				if (onokay) onokay(form)
				this.close()
			}
			okbtn.focus()
			form.querySelector("#modal-confirm-cancel").onclick = ()=>{
				if (oncancel) oncancel(form)
				this.close()
			}
		})
	}
}


class ModalToast extends Modal {

	constructor() {
		let elem = document.createElement("div")
		elem.style.minWidth = '200px'
		elem.style.flexDirection = 'row'
		elem.style.justifyContent = 'space-around'
		elem.style.alignItems = 'center'
		elem.style.padding = "10px"
		elem.style.borderRadius = "5px"

		elem.innerHTML += '<img id="modal-toast-icon" src="" alt="">'
		let msgelem = document.createElement('b')
		msgelem.id = "modal-toast-msg"
		Object.assign(msgelem.style, {
			flex:'1',
			textAlign:'center',
			marginRight: '5px',
			marginLeft: '5px',
			color:'black',
		})
		elem.appendChild(msgelem)

		super(elem, {
			displayStyle: "flex",
			noCloseBtn: true,
			noFade: true,
			width: "auto",
			height:"50px",
		})
		this.container.style.margin = "25px"
		this.bg.style.pointerEvents = "none"
		this.fg.style.pointerEvents = "none"
	}

	open(msg, options) {
		options = options || {}
		const placement = options.placement || "right-top" // can be right-top, right-bottom, left-top and left-bottom
		const timeout = options.timeout || 5000
		const icon = options.icon || null

		if (placement.startsWith('right')) {
			this.fg.style.justifyContent = 'flex-end'
			this.transitionStartPos = {top: '0px', left: "50px"}
		} else if (placement.startsWith('left')) {
			this.fg.style.justifyContent = 'flex-start'
			this.transitionStartPos = {top: '0px', left: "-50px"}
		}

		if (placement.endsWith('bottom')) {
			this.fg.style.alignItems = 'flex-end'
		} else if (placement.endsWith('top')) {
			this.fg.style.alignItems = 'flex-start'
		}

		this._resetTransition()
		clearTimeout(this._timeout)
		super.open().then((form)=>{
			if (icon) {
				let iconElem = form.querySelector("#modal-toast-icon")
				iconElem.src = icon
				iconElem.setAttribute('width', '25px')
			}
			form.querySelector("#modal-toast-msg").innerHTML = msg
			this._timeout = setTimeout(()=>this.close(), timeout)
		})
	}
}


const modal_alert = new ModalAlert()
const modal_confirm = new ModalConfirm()

const modal_toast = new ModalToast()
