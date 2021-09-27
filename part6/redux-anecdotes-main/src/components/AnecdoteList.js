import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Anecdote from './Anecdote';
import { voteFor }  from './../reducers/anecdoteReducer';
import { setNotification, removeNotification, notification } from './../reducers/notificationReducer';

const AnecdoteList = () => {
    const filterValue = useSelector(state => state.filter);
    const anecdotes = useSelector(state => {
        return state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filterValue.toLowerCase()));
    });
    const dispatch = useDispatch();

    const voteClicked = id => {
        dispatch(voteFor(id));
        dispatch(notification(`Successfully voted for anecdote!`, 5));
    };

    return (
        <div>
            <h2>Anecdotes</h2>
                {anecdotes.map(anecdote => <Anecdote key={anecdote.id} anecdote={anecdote} 
                                                     voteClicked={voteClicked} />)}
        </div>
    )
};

export default AnecdoteList;
