import React from 'react';

const Anecdote = ({ anecdote, voteClicked }) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button type="button" onClick={() => voteClicked(anecdote.id)}>vote</button>
            </div>
        </div>
    );
};

export default Anecdote;
