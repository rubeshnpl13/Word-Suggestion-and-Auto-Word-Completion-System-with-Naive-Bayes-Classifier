function validator(schema) {
    return function(name, value, handler) {
        let err = handler.errors;
        let res = schema(name, value);

        if (res)
            err[name] = res
        else
            delete err[name]

        return handler.setErrors({...err })
    }
}

export default validator;