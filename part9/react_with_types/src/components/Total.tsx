import React from 'react';
import { CoursePart } from '../types';

type TotalProps = {
    courseParts: CoursePart[];
};

const Total = (props: TotalProps) => {
    return (
        <div>
        <p>
            Number of exercises{" "}
            {props.courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
        </p>
        </div>
    );
}

export default Total;
