import React, { useState } from 'react'

const RandomNumberGenerator = ({ numberSetter, minNumber, maxNumber }) => {
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    return (
        <div>
            <button onClick={() => numberSetter(getRandomInt(maxNumber)) + minNumber}>next anecdote</button>
        </div>
    )
}

const VoteDisplay = ({ scores, selectedId }) => {
    return (
        <div>
            voted for by {scores[selectedId]} times
        </div>
    )
}

const VoteButton = ({ scores, setScores, selectedId }) => {
    function increaseByOne()
    {
        const newScores = [...scores];
        newScores[selectedId] += 1;
        setScores(newScores);
    }

    return (
        <div>
            <button onClick={increaseByOne}>vote</button>
        </div>
    )
}

const DisplayBest = ({ anecdotes, scores }) => {
    let maxScore = -1;
    let maxScoreId = -1;
    for (let i = 0; i < scores.length; i++)
    {
        if (maxScore < scores[i])
        {
            maxScore = scores[i];
            maxScoreId = i;
        }
    }

    if (maxScoreId === -1 || maxScoreId >= anecdotes.length)
    {
        return (
            <div>
                <h1>Error deciding best anecdote!</h1>
            </div>
        )
    }
    else
    {
        return (
            <div>
                <h1>Best anecdote:</h1>
                <p>{anecdotes[maxScoreId]}</p>
                <p>has {maxScore} votes</p>
            </div>
        )
    }
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   
  const [selected, setSelected] = useState(0)
  const [scores, setScores] = useState(Array(anecdotes.length).fill(0))

  return (
    <div>
        {anecdotes[selected]}
        <VoteDisplay scores={scores} selectedId={selected} />
        <VoteButton scores={scores} setScores={setScores} selectedId={selected} />
        <RandomNumberGenerator numberSetter={setSelected} minNumber={0} maxNumber={anecdotes.length} />
        <DisplayBest scores={scores} anecdotes={anecdotes} />
    </div>
  )
}

export default App