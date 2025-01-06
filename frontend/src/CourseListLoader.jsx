export default function CourseListLoader(courses) {
    return courses.map(value => {
        const decodedBase64 = atob(value.image)
        console.log(decodedBase64)
        const byteNumbers = new Array(decodedBase64.length)

        for (let i = 0; i<decodedBase64.length; i++) {
            byteNumbers[i] = decodedBase64.charCodeAt(i)
        }

        const uint8array = new Uint8Array(byteNumbers)
        const blob = new Blob(uint8array)

        return {...value, image: URL.createObjectURL(blob)}
    })
}