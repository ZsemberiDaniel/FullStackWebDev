import { useLazyQuery, useSubscription } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { BOOKS_FROM_GENRE, BOOK_ADDED } from '../queries';

const BookGenreFilter = ({ genreOptions, selectedGenre, setSelectedGenre }) => {
    return (
        <div>
            <h4>Filter genres</h4>
            <Select name='name' options={genreOptions} defaultValue={selectedGenre} onChange={setSelectedGenre} />
        </div>
    )
};

const Books = (props) => {
    const [getBooks, result] = useLazyQuery(BOOKS_FROM_GENRE,{
        fetchPolicy: 'no-cache'
    });
    const [genreFilter, setGenreFilter] = useState(null);
    const [books, setBooks] = useState([]);
    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData }) => {
            getBooks({ variables: { genre: genreFilter ? genreFilter.value : '' } });
        }
    });
    
    useEffect(() => {
        getBooks({ variables: { genre: genreFilter ? genreFilter.value : '' } });
    }, [genreFilter]); // eslint-disable-line

    useEffect(() => {
        if (result.data) {
            setBooks(result.data.allBooks);
        }
    }, [result]);

    if (result.loading) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    if (!props.show) {
        return null;
    }

    return (
        <div>
            <h2>books</h2>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            author
                        </th>
                        <th>
                            published
                        </th>
                    </tr>
                    {books
                        .filter(a => genreFilter === null || genreFilter.value === '' || a.genres.includes(genreFilter.value))
                        .map(a =>
                            <tr key={a.title}>
                                <td>{a.title}</td>
                                <td>{a.author.name}</td>
                                <td>{a.published}</td>
                            </tr>
                    )}
                </tbody>
            </table>
            <BookGenreFilter genreOptions={props.genres} selectedGenre={genreFilter} setSelectedGenre={setGenreFilter} />
        </div>
    );
};

export default Books;
