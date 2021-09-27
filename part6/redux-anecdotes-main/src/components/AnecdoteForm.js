import React from 'react';
import { connect } from 'react-redux';
import { create } from '../reducers/anecdoteReducer';
import { notification } from './../reducers/notificationReducer';

const AddAnecdote = (props) => {
    const addAnecdote = async (event) => {
        event.preventDefault();

        const anecdoteContent = event.target.anecdote.value;
        event.target.anecdote.value = '';
        props.create(anecdoteContent);
        props.notification(`Successfully created new anecdote`, 2);
    };

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input name='anecdote' id='newAnecdoteName' type='text' /></div>
                <button type='submit'>create</button>
            </form>
        </div>
    );
};

const mapStateToProps = (state) => {
    return { };
};

const mapStateToDispatch = {
    create, notification
};

export default connect(mapStateToProps, mapStateToDispatch)(AddAnecdote);
