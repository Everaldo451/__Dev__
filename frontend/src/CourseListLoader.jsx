export default function CourseListLoader(courses) {
    return courses.map(value => {
        const decodedBase64 = atob(value.image)
        console.log(value.image, decodedBase64)
        const uint8Array = new Uint8Array(decodedBase64.length)

        for (let i = 0; i<decodedBase64.length; i++) {
            uint8Array[i] = decodedBase64.charCodeAt(i)
        }

        return {...value, image: URL.createObjectURL(new Blob(uint8Array))}
    })
}