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
			el.getType('image/png')
			.then(blob => {
				reader.readAsDataURL(blob)
			})
		})
	})
}

function copyImg() {
	if (!img || img.src == location.href) return alert('Cole ou envie uma imagem para criar seu meme.')
	createMeme('blob')
	.then(response => {
		navigator.clipboard.write([new ClipboardItem({'image/png': response})])
		.then(() => {
			alert('Meme copiado 😁')
		})
	})
}

function downloadImg() {
	if (!img || img.src == location.href) return alert('Cole ou envie uma imagem para criar seu meme.')
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
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 ${imgSize} ${imgSize}">
	<image width="${imgSize}" height="${imgSize}" preserveAspectRatio="xMidYMid slice" xlink:href="${img.src}">
</image>
<text font-family="sans-serif" x="50%" y="36px" style="fill: #fff; stroke: #000; stroke-width: 2; dominant-baseline:central; text-anchor:middle; font-size:48px; font-weight: bold;">${header}</text>
<text font-family="sans-serif" x="50%" y="${imgSize-48}px" style="fill: #fff; stroke: #000; stroke-width: 2; dominant-baseline:central; text-anchor:middle; font-size:48px; font-weight: bold;">${footer}</text>
</svg>`
	let meme = new Image()
	meme.width = imgSize
	meme.height = imgSize
	let blob = new Blob([svg], {type: "image/svg+xml;charset=utf-8"})
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