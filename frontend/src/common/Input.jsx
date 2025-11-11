function Input({ label, type, placeholder, handler, name, id, value, error }) {
    return (
        <div className="mb-3">
            <label htmlFor={id}>{label}</label>
            <input 
                name={ name } 
                type={ type }
                className="form-control"
                id={ id }
                placeholder={ placeholder }
                onChange={ handler }
                value={ value }
            />
            { error && <div id={id+"help"} className="form-text text-danger">*{error}</div> }
        </div>
    );
}

export default Input;