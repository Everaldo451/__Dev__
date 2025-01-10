export default function PageChangeButton({pageState, courses, reduce=false, children}) {

    const [page, setPage] = pageState

    let onClick;
    if (reduce) {
        onClick = (e) => {
            page-1>=0?setPage(prev => prev-1):null
        }
    } else {
        onClick = (e) => {
            setPage(prev => prev+1)
        }
    }

    return <button onClick={onClick}>{children}</button>
}