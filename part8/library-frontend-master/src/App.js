import { useApolloClient, useLazyQuery, useSubscription } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import LoginForm from './components/LoginForm';
import NewBook from './components/NewBook';
import Recommended from './components/Recommended';
import { ALL_BOOKS, BOOK_ADDED } from './queries';

const Notify = ({errorMessage}) => {
    if ( !errorMessage ) {
        return null;
    }
    return (
        <div style={{color: 'red'}}>
            {errorMessage}
        </div>
    );
}

const App = () => {
    const [token, setToken] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [page, setPage] = useState('authors');
    const [getAllBooks, allBooksResult] = useLazyQuery(ALL_BOOKS);
    const [allBooks, setAllBooks] = useState([]);
    const client = useApolloClient();
    
    useEffect(() => {
        if (allBooksResult.data) {
            setAllBooks(allBooksResult.data.allBooks);
        }
    }, [allBooksResult]);

    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData }) => {
            // const addedBook = subscriptionData.data.bookAdded;
            getAllBooks();     
        }
    });

    const genres = allBooksResult.data ? ['', ...new Set(allBooksResult.data.allBooks.flatMap(a => a.genres))]
        .map(o => { return { value: o, label: o === '' ? 'all' : o }; }) : [];

    useEffect(() => {
        setToken(localStorage.getItem('books_user_token'));
    }, []);

    const notify = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 4000);
    };

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
    };

    return (
        <div>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                <button onClick={() => setPage('add')}>add book</button>
                <button onClick={() => setPage('recommended')}>recommend</button>
                {!token && (() => <button onClick={() => setPage('login')}>login</button>)()}
                {token && (() => <button onClick={() => logout()}>logout</button>)()}
            </div>

            <Notify errorMessage={errorMessage} />
            <Authors
                show={page === 'authors'} notify={notify} token={token}
            />

            <Books
                show={page === 'books'} notify={notify} genres={genres}
            />

            <NewBook
                show={page === 'add'} notify={notify} token={token}
            />

            <LoginForm
                show={page === 'login'} notify={notify} setToken={setToken}
            />

            <Recommended
                show={page === 'recommended'} notify={notify} token={token} allBooks={allBooks}
            />

        </div>
    );
};

export default App;
