function createUserSchema(name, value) {
    switch (name) {
        case "name":
            if (value === "")
                return "Name is required";
            else
                return false
        case "email":
            if (value === "")
                return "Email is required";
            else if (!value.includes("@"))
                return "Invalid email address";
            else
                return false

        default:
            break;
    }
}

export default createUserSchema;