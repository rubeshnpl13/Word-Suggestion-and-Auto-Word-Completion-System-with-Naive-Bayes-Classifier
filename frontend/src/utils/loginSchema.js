function loginSchema(name, value) 
{
    switch(name)
    {
        case "email":
            if(value === "")
                return "Email is required";
            else if(!value.includes("@"))
                return "Invalid email address";
            else
                return false
        case "password":
            if(value === "")
                return "Password is required";
            else
                return false
        default:
            break;
    }
}

export default loginSchema;