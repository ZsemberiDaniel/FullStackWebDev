import React, { useState } from 'react'

const Button = ({ text, onClick }) => {
    return (
        <>
            <button onClick={onClick}>{text}</button>
        </>
    )
}

const StatisticLine = ({ text, value }) => {
    return (
        <>
            <tr><td>{text}</td><td>{value}</td></tr>
        </>
    )
}

const UserInput = ({ onGoodClicked, onNeutralClicked, onBadClicked }) => {
    return (
        <div>
            <h1>give feedback :)</h1>
            <Button onClick={onGoodClicked} text="good"/>
            <Button onClick={onNeutralClicked} text="neutral"/>
            <Button onClick={onBadClicked} text="bad" />
        </div>
    )
}

const Statistics = ({ goodCount, neutralCount, badCount }) => {
    const all = goodCount + neutralCount + badCount;
    if (all === 0)
    {
        return (
            <div>
                <h1>statistics</h1>
                <p>No feedback given</p>
            </div>
        )
    }
    else
    {
        return (
            <div>
                <h1>statistics</h1>
                <table>
                    <tbody>
                    <StatisticLine text="good" value={goodCount} />
                    <StatisticLine text="neutral" value={neutralCount} />
                    <StatisticLine text="bad" value={badCount} />
                    <StatisticLine text="all" value={all} />
                    <StatisticLine text="average" value={all === 0 ? 0 : (goodCount - badCount) / all} />
                    <StatisticLine text="positive" value={(all === 0 ? 0 : goodCount / all * 100) + "%"} />
                    </tbody>
                </table>
            </div>
        )
    }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
        <UserInput onGoodClicked={() => setGood(good + 1)}
                    onNeutralClicked={() => setNeutral(neutral + 1)}
                    onBadClicked={() => setBad(bad + 1)} />
        <Statistics goodCount={good}
                    neutralCount={neutral}
                    badCount={bad} />
    </div>
  )
}

export default App
