export function Image({src, className}) {
    return <div className={className} style={{backgroundImage:`url(${src})`}}></div>
}