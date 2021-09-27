import axios from "axios";

const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
    const anecdotes = await axios.get(baseUrl);
    return anecdotes.data;
};

const get = async (id) => {
    const anecdotes = await axios.get(`${baseUrl}/${id}`);
    return anecdotes.data;
};

const asObject = (anecdote) => {
    return {
        content: anecdote,
        votes: 0
    };
};

const post = async (newAnecdote) => {
    const response = await axios.post(baseUrl, asObject(newAnecdote));
    return response.data;
};

const put = async (newAnecdote) => {
    const response = await axios.put(`${baseUrl}/${newAnecdote.id}`, newAnecdote);
    return response.data;
};

export default { get, getAll, post, put };
