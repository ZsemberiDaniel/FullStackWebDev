import anecdoteServices from './../services/anecdotes';

const reducer = (state = [], action) => {
    let newState;
    switch (action.type) {
        case 'VOTE_FOR':
            const anecdoteToChange = state.find(anecdote => anecdote.id === action.data.id);
            const newAnecdote = {
                ...anecdoteToChange,
                votes: anecdoteToChange.votes + 1
            };
            newState = state.map(anecdote => anecdote.id === newAnecdote.id ? newAnecdote : anecdote);
            break;
        case 'CREATE':
            newState = [...state, action.data];
            break;
        case 'INIT':
            newState = [...action.data];
            break;
        case 'UPDATE':
            const updatedAnecdote = {
                ...action.data
            };
            newState = state.map(anecdote => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote);
            break;
        default:
            newState = state;
            break;
    }

    const comparer = (a1, a2) => {
        if (a1.votes === a2.votes) return a1.content < a2.content ? 1 : -1;
        
        return a1.votes < a2.votes ? 1 : -1;
    }
    newState.sort(comparer);
    return newState;
};

export const create = (anecdoteContent) => {
    return async dispatch => {
        const newAnecdote = await anecdoteServices.post(anecdoteContent);
        dispatch({
            type: 'CREATE',
            data: newAnecdote
        });
    };
};

export const voteFor = (id) => {
    return async dispatch => {
        const oldAnecdote = await anecdoteServices.get(id);
        const newAnecdote = {
            ...oldAnecdote,
            votes: oldAnecdote.votes + 1
        };
        await anecdoteServices.put(newAnecdote);
        dispatch({
            type: 'UPDATE',
            data: newAnecdote
        });
    }
};

export const init = () => {
    return async dispatch => {
        const newNotes = await anecdoteServices.getAll();
        dispatch({
            type: 'INIT',
            data: newNotes
        });
    }
}

export default reducer;