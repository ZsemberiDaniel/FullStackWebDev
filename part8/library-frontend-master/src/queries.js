import { gql } from '@apollo/client';

export const BOOK_ADDED = gql`
subscription {
    bookAdded {
        title
        published
        author {
            name
            born
        }
        genres
    }
}
`;

export const ALL_AUTHORS = gql`
query {
    allAuthors {
        name
        born
        bookCount
    }
}
`;

export const BOOKS_FROM_GENRE = gql`
query getBooks($genre: String!) {
    allBooks(genre: $genre) {
        title
        published
        author {
            name
        }
        genres
    }
}
`;

export const ALL_BOOKS = gql`
query {
    allBooks {
        title
        published
        author {
            name
        }
        genres
    }
}
`;

export const ME = gql`
query {
    me {
        favoriteGenre
        username
    }
}
`;

export const ADD_BOOK = gql`
mutation createBook($title: String!, $published: Int!, $genres: [String!]!, $author: String!) {
    addBook(title: $title, published: $published, genres: $genres, author: $author) {
        title
        published
        genres
        author {
            name
        }
    }
}
`;

export const UPDATE_AUTHOR = gql`
mutation updateAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
        name
        born
    }
}
`;

export const LOGIN = gql`
mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
        value
    }
}
`;
