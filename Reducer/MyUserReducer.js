const MyUserReducer = (currentState, action) => {
    switch(action.type) {
        case "Login":
            return action.payload;
        case "Logout":
            return null;
    }
    return currentState;
}

export default MyUserReducer;