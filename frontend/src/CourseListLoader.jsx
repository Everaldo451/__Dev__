export default function CourseListLoader(courses) {
    return courses.map(value => {

        let decodedBase64;
        try {
            if (!value.image || !value.image.startsWith("data:image")) {
                throw new Error("invalid image format")
            }
            decodedBase64 = atob(value.image.split(",",1)[1])
        } catch (error) {
            return value
        }

        const uint8Array = new Uint8Array(decodedBase64.length)

        for (let i = 0; i<decodedBase64.length; i++) {
            uint8Array[i] = decodedBase64.charCodeAt(i)
        }

        return {...value, image: URL.createObjectURL(new Blob(uint8Array))}
    })
}