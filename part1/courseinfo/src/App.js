import React from 'react'

const Header = (course) => {
    return (<>
        <h1>{course.name}</h1>
    </>)
}

const Part = (part) => {
    return (
        <div>
            <p>{part.name} {part.exerciseCount}</p>
        </div>
    )
}

const Content = (course) => {
    return (
        <div>
            <Part name={course.parts[0].name} exerciseCount={course.parts[0].exercises} />
            <Part name={course.parts[0].name} exerciseCount={course.parts[1].exercises} />
            <Part name={course.parts[0].name} exerciseCount={course.parts[2].exercises} />
        </div>
    )
}

const Total = (total) => {
    let pointSum = 0;
    for (let i = 0; i < total.parts.length; i++)
    {
        pointSum += total.parts[i].exercises;
    }
    return (
        <p>Number of exercises {pointSum}</p>
    )
}

const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
          {
            name: 'Fundamentals of React',
            exercises: 10
          },
          {
            name: 'Using props to pass data',
            exercises: 7
          },
          {
            name: 'State of a component',
            exercises: 14
          }
        ]
      }

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App