const reducer = (state, action) => {
  switch (action.type) {
    case "JOINED":
      return {
        ...state,
        joined: true,
        userName: action.payload.userName,
        roomId: action.payload.roomId,
      };

    case "SET-USERS":
      return {
        ...state,
        users: [...action.payload],
      };

    case "NEW-MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case "SET-MESSAGES-LIST":
      return {
        ...state,
        messages: [...state.messages, ...action.payload],
      };

    default:
      return state;
  }
};

export default reducer;
