const initialState = {
    TokenObject:{
        Token:'',
        isAuthorized:false
    }
}

function TokenReducer(state = initialState, action) {
    switch (action.type) {

        case 'Save_Token': {
            return {
                ...state,
                TokenObject: {
                    Token:action.payload.token,
                    isAuthorized:true,
                    userInfo:action.payload
                }
            }
        }
        case 'getToken':{
            return state;
        }
        default:
            return state;
    }
}
export default TokenReducer;