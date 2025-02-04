interface ImageProps {
    src:string,
    className:string
}

export default function Image({src, className}:ImageProps) {
    return <div className={className} style={{backgroundImage:`url(${src})`}}></div>
}