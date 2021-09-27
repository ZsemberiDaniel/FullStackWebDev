import React, { useEffect } from 'react';
import AddAnecdote from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList';
import Notification from './components/Notification';
import AnecdoteFilter from './components/AnecdoteFilter';
import { useDispatch } from 'react-redux';
import { init } from './reducers/anecdoteReducer';

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(init());
    }, [dispatch]);

    return (
        <div>
            <Notification />
            <AnecdoteFilter />
            <AnecdoteList />
            <AddAnecdote />
        </div>
    );
}

export default App;