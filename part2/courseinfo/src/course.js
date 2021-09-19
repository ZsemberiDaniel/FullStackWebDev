import React from 'react';

const Header = ({ course }) => {
    return (
      <h1>{course.name}</h1>
    )
  }
  
  const Total = ({ course }) => {
    let sum = course.parts.map(c => c.exercises).reduce((a, b) => a + b);
    return(
      <p><b>total of {sum} exercise(s)</b></p>
    ) 
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>    
    )
  }
  
  const Content = ({ course }) => {
    return (
      <div>
          {course.parts.map(c => <Part part={c} key={c.id} />)}
      </div>
    )
  }
  
  const Course = ({ course }) => {
      return (
          <div>
              <Header course={course} />
              <Content course={course} />
              <Total course={course} />
          </div>
      )
  }
  
export default Course