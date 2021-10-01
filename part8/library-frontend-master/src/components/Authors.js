import React, { useEffect, useState } from 'react';
import { useLazyQuery, useSubscription } from '@apollo/client';
import { ALL_AUTHORS, BOOK_ADDED } from '../queries';
import UpdateAuthors from './UpdateAuthor';

const Authors = (props) => {
    const [getAuthors, result] = useLazyQuery(ALL_AUTHORS,{
        fetchPolicy: 'no-cache'
    });
    const [authors, setAuthors] = useState([]);
    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData }) => {
            getAuthors();
        }
    });

    useEffect(() => getAuthors(), []);

    useEffect(() => {
        if (result.data) {
            setAuthors(result.data.allAuthors);
        }
    }, [result]);

    if (!props.show) {
        return null;
    }

    if (result.loading) {
        return (
            <div>
                Loading authors...
            </div>
        );
    }

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            born
                        </th>
                        <th>
                            books
                        </th>
                    </tr>
                    {authors.map(a =>
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <UpdateAuthors authors={authors} notify={props.notify} token={props.token} />
        </div>
    );
};

export default Authors;
