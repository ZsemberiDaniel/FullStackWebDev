import React from 'react';
import { CoursePart } from '../types';
import Part from './Part';

export type ContentProps = {
    course: CoursePart;
};

const Content = (props: ContentProps) => {
    return (
        <div>
			<p>
				<b>{props.course.name} {props.course.exerciseCount}</b> <br />
                <Part course={props.course} /> <br />
			</p>
        </div>
    );
}

export default Content;
