import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ADD_BOOK } from '../queries';

const NewBook = (props) => {
    const [title, setTitle] = useState('');
    const [author, setAuhtor] = useState('');
    const [published, setPublished] = useState('');
    const [genre, setGenre] = useState('');
    const [genres, setGenres] = useState([]);
    const [ createBook ] = useMutation(ADD_BOOK, {
        // refetchQueries: [ { query: ALL_AUTHORS }, { query: ALL_BOOKS } ],
        onError: (error) => {
            props.notify(error.graphQLErrors[0].message);
        }
    });

    if (!props.show) {
        return null;
    }

    if (!props.token) {
        return <div>Login to add books!</div>
    }

    const submit = async (event) => {
        event.preventDefault();

        createBook({
            variables: { title, author, published: Number(published), genres }
        });

        setTitle('');
        setPublished('');
        setAuhtor('');
        setGenres([]);
        setGenre('');
    }

    const addGenre = () => {
        setGenres(genres.concat(genre));
        setGenre('');
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    title
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        value={author}
                        onChange={({ target }) => setAuhtor(target.value)}
                    />
                </div>
                <div>
                    published
                    <input
                        type='number'
                        value={published}
                        onChange={({ target }) => setPublished(target.value)}
                    />
                </div>
                <div>
                    <input
                        value={genre}
                        onChange={({ target }) => setGenre(target.value)}
                    />
                    <button onClick={addGenre} type="button">add genre</button>
                </div>
                <div>
                    genres: {genres.join(' ')}
                </div>
                <button type='submit'>create book</button>
            </form>
        </div>
    );
};

export default NewBook;
