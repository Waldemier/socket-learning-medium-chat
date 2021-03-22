export default function reducer(state, action) {
    switch (action.type) {
        case 'JOINING':
            return {
                ...state, 
                joined: true, 
                roomId: action.payload.roomId, 
                userName: action.payload.userName
            }
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload
            }
        case 'SET_MESSAGE':
            console.log(action.payload)
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        default:
            return state;
    }
}
