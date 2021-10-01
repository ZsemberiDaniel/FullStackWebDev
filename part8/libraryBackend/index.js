const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server-express');
const express = require('express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { createServer } = require('http');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const Authors = require('./models/Author');
const Books = require('./models/Book');
const User = require('./models/User');

const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

const app = express();
const cors = require('cors');
app.use(cors());
const JWT_SECRET = 'MY_SECRET_KEY_IS_HERE';

const MONGODB_URI = '...';
mongoose.connect(MONGODB_URI)
    .then((result) => {
        console.log(`Connected to MongoDB ${result}`);
    })
    .catch((error) => {
        console.log(`Could not connect to MongoDB ${error}`);
    });
mongoose.set('debug', true);

const typeDefs = gql`
    type Subscription {
        bookAdded: Book!
    }

    type User {
        username: String!
        favoriteGenre: String!
        id: ID!
    }

    type Token {
        value: String!
    }

    type Author {
        name: String!
        id: ID!
        born: Int
        bookCount: Int!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        genres: [String!]!
        id: ID!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
        me: User
    }

    type Mutation {
        addBook(
            title: String!
            published: Int!
            genres: [String!]!
            author: String!
        ): Book
        editAuthor(
            name: String!
            setBornTo: Int!
        ): Author
        createUser(
            username: String!
            favoriteGenre: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
    }
`

const resolvers = {
    Mutation: {
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre });

            try {
                return await user.save()
            } catch (exception) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            };
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });
        
            if (!user) {
                throw new UserInputError("wrong credentials");
            }
        
            const userForToken = {
                username: user.username,
                id: user._id,
            };
        
            return { value: jwt.sign(userForToken, JWT_SECRET) }
        },
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new AuthenticationError("Login to add books!");
            }

            let author = await Authors.findOne({ name: args.author });
            if (!author) {
                author = new Authors({
                    name: args.author,
                    bookCount: 0
                });

                try {
                    await author.save();
                } catch (exception) {
                    throw new UserInputError(exception.message, {
                        invalidArgs: args
                    });
                }
            }

            let book = new Books({ ...args });
            book.author = author._id;

            try {
                await book.save();
            } catch (exception) {
                throw new UserInputError(exception.message, {
                    invalidArgs: args
                });
            }

            author.bookCount += 1;
            try {
                await author.save();
            } catch (exception) {
                throw new UserInputError(exception.message, {
                    invalidArgs: args
                });
            }

            book = book.populate('author');
            pubsub.publish('BOOK_ADDED', { bookAdded: book });

            return book;
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser;
            if (!currentUser) {
                throw new AuthenticationError("Login to add books!");
            }

            const author = await Authors.findOne({ name: args.name });
            if (!author) return null;

            author.born = args.setBornTo;

            try {
                await author.save();
            } catch (exception) {
                throw new UserInputError(exception.message, {
                    invalidArgs: args
                });
            }
            return author;
        }
    },
    Query: {
        bookCount: async () => await Books.collection.countDocuments(),
        authorCount: async () => await Authors.collection.countDocuments(),
        allBooks: async (root, args, context) => {
            if (args.author && args.genre)
                return await Books.find({ genres: args.genre, author: args.author }).populate('author');
            else if (args.author)
                return await Books.find({ author: args.author }).populate('author');
            else if (args.genre)
                return await Books.find({ genres: args.genre }).populate('author');
            else 
                return await Books.find({}).populate('author');
        },
        allAuthors: async () => await Authors.find({}),
        me: (root, args, context) => context.currentUser
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        }
    }
}

const httpServer = createServer(app);
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;

        if (auth && auth.toLowerCase().startsWith('bearer ')) {
            const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
        }
    },
    plugins: [{
        async serverWillStart() {
            return {
                async drainServer() {
                    subscriptionServer.close();
                }
            };
        }
    }]
});
const subscriptionServer = SubscriptionServer.create({
    // This is the `schema` we just created.
    schema,
    // These are imported from `graphql`.
    execute,
    subscribe,
 }, {
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // This `server` is the instance returned from `new ApolloServer`.
    path: server.graphqlPath,
 });
(async () => { 
    await server.start();
    server.applyMiddleware({ app, path: '/' });

    httpServer.listen(4000, () => {
        console.log(`Server is now running on http://localhost:4000/`);
    });
})();
