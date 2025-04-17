
import './Button.css'
function Button({label,handler,icon}) {
    return (

        <button className="primary-btn"
        onClick={handler}
        >
            {icon && icon}
            {label}
        </button>
    )
}

export default Button
