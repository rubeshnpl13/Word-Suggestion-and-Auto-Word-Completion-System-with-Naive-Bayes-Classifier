function registerSchema(name, value) 
{
    switch(name)
    {
        case "name":
            if(value === "")
                return "Name is required";
            else
                return false
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
            else if(value.length < 8)
                return "Password must be at least 8 characters";
            else
                return false
        case "confirmPassword":
            if(value === "")
                return "Confirm password is required";
            else if(value !== document.getElementById("password").value)
                return "Passwords do not match";
            else
                return false
        default:
            break;
    }
}

export default registerSchema;