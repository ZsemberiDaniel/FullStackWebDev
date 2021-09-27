const filterReducer = (state = '', action) => {
    switch (action.type) {
        case 'CHANGE':
            return action.data.text;
        default:
            return state;
    }
};

export const changeFilter = newVal => {
    return {
        type: 'CHANGE',
        data: {
            text: newVal
        }
    };
};

export default filterReducer;
