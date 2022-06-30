navigator.serviceWorker?.register('service-worker.js')

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const reader = new FileReader()
const img = document.querySelector('#meme')
var imgSize = 512

function pasteImg() {
	navigator.clipboard.read()
	.then(response => {
		response.forEach(el => {
			if (!el.types.includes('image/png')) return alert('Não há nenhuma imagem copiada para colar ☹️')
			return el.getType('image/png')
			.then(blob => {
				reader.readAsDataURL(blob)
			})
		})
	})
	.catch(error => {
		alert('Falha ao colar a imagem ☹️ mas você pode fazer o upload dela 😉')
	})
}

function copyImg() {
	if (!img.src || img.src == location.href) return alert('Cole ou envie uma imagem para criar seu meme.')
	navigator.clipboard.write([new ClipboardItem({'image/png': createMeme('blob')})])
	.then(() => {
		alert('Meme copiado 😁')
	})
	.catch(error => {
		alert('Falha ao copiar o meme ☹️ mas você pode fazer o download 😉')
	})
}

function downloadImg() {
	if (!img.src || img.src == location.href) return alert('Cole ou envie uma imagem para criar seu meme.')
	createMeme('base64')
	.then(response => {
		let link = document.createElement('a')
		link.download = 'meme.png'
		link.href = response
		document.documentElement.appendChild(link)
		link.click()
		setTimeout(() => {document.documentElement.removeChild(link), 100})
	})
}

function createMeme(type='base64') {
	let texts = document.querySelectorAll('input[type=text]')
	let header = texts[0].value
	let footer = texts[1].value
	let svg = `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" font-family="Play, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" dominant-baseline="central" viewBox="0 0 ${imgSize} ${imgSize}">
	<image width="${imgSize}" height="${imgSize}" preserveAspectRatio="xMidYMid slice" xlink:href="${img.src}"></image>
	<text x="50%" y="36px" fill="#fff" stroke="#000" stroke-width="2">${header}</text>
	<text x="50%" y="${imgSize-48}px" fill="#fff" stroke="#000" stroke-width="2">${footer}</text>
</svg>`
	let meme = new Image()
	meme.width = imgSize
	meme.height = imgSize
	let blob = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'})
	let url = URL.createObjectURL(blob)
	meme.src = url
	return new Promise(resolve => {
		meme.onload = () => {
			canvas.width = meme.width
			canvas.height = meme.height
			context.imageSmoothingEnabled = false
			context.clearRect(0, 0, canvas.width, canvas.height)
			context.drawImage(meme, 0, 0, canvas.width, canvas.height)
			if (type == 'blob') {
				canvas.toBlob(blob => resolve(blob), 'image/png')
			} else if (type == 'base64') {
				resolve(canvas.toDataURL('image/png'))
			}
		}
	})
}

function refreshSize() {
	imgSize = window.innerWidth > 512 ? 512 : (window.innerWidth - 24)
	document.documentElement.style.setProperty('--vw', `${imgSize}px`)
}

document.querySelector('#button-paste').onclick = () => pasteImg()
document.querySelector('#button-copy').onclick = () => copyImg()
document.querySelector('#button-download').onclick = () => downloadImg()
document.querySelector('input[type=file]').onchange = e => {
	let picture = e.target.files[0]
	if (picture) reader.readAsDataURL(picture)
}

reader.onload = e => { img.src = e.target.result }
window.onload = () => refreshSize()
window.onresize = () => refreshSize()