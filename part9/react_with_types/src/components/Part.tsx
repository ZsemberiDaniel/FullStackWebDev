import React from 'react';
import { CoursePart } from '../types';

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

type PartProps = {
    course: CoursePart;
};

const Part = (props: PartProps) => {
    switch (props.course.type) {
    case 'normal':
        return (
            <div>
                <i>{props.course.description}</i>
            </div>
        );
    case 'groupProject':
        return (
            <div>
                Group project count: {props.course.groupProjectCount}
            </div>
        );
    case 'submission':
        return (
            <div>
                <i>{props.course.description}</i> <br />
                <a href={props.course.exerciseSubmissionLink}>Submit the exercises here!</a>
            </div>
        );
    case 'special':
        return (
            <div>
                <i>{props.course.description}</i> <br />
                Requirements:
                <ul>
                    {props.course.requirements.map((name, i) => <li key={i}>{name}</li>)}
                </ul>
            </div>
        )
    default:
        return assertNever(props.course);
    }
};

export default Part;