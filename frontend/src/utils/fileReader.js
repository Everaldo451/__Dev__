function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (ev) => {resolve(ev.target.result)}
        reader.onerror = (ev) => {reject(ev.target.error)}
        reader.readAsArrayBuffer(file)
    })
}

function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (ev) => {resolve(ev.target.result)}
        reader.onerror = (ev) => {reject(ev.target.error)}
        reader.readAsDataURL(file)
    })
}

async function fileToBlobURL(file, type) {

    const arrayBuffer = await readFile(file)
    const uint8Array = new Uint8Array(arrayBuffer)
    const blob = new Blob([uint8Array], {type: type})
    const url = URL.createObjectURL(blob)        

    return url
}