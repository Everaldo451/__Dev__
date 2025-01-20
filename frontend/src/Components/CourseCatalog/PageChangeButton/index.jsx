export default function PageChangeButton({setPage, reduce=false, children}) {
    let onClick;

    if (reduce) {
        onClick = (e) => {setPage(prev => prev-1>0?prev-1:prev)}
    } else {
        onClick = (e) => {setPage(prev => prev+1)}
    }
    return <button onClick={onClick}>{children}</button>
}