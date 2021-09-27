const reducer = (state = '', action) => {
    switch (action.type) {
        case 'ADD':
            return action.data.text;
        case 'REMOVE':
            return '';
        default:
            return state;
    }
};

export const setNotification = (text) => {
    return {
        type: 'ADD',
        data: { text }
    }
};

export const removeNotification = () => {
    return {
        type: 'REMOVE',
        data: {}
    }
}

let notiId = 0;
export const notification = (text, time) => {
    const currentNotiId = ++notiId;
    return async dispatch => {
        dispatch({
            type: 'ADD',
            data: { text }
        });
        await new Promise(resolve => setTimeout(resolve, time * 1000));
        if (currentNotiId === notiId)
            dispatch({
                type: 'REMOVE',
                data: {}
            });
    };
};

export default reducer;