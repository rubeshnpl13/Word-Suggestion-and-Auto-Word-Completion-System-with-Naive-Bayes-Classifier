function Button({ label, type, color, handler}) {
    const btnClass = `btn btn-${color}`
    if(type === "button")
        return (
            <button type={type} className={btnClass} onClick={handler}>{ label }</button>
        )
    else
        return (
            <button type={type} className={btnClass}>{ label }</button>
        )
}

export default Button;