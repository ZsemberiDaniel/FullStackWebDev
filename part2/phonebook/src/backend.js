import axios from 'axios';

const backendUrl = '/api/persons';

const getAll = () => axios.get(backendUrl).then((response) => response.data);

const create = (newPerson) => axios.post(backendUrl, newPerson).then((response) => response.data);

const update = (id, updatedPerson) => axios.put(`${backendUrl}/${id}`, updatedPerson).then((response) => response.data);

const del = (id) => axios.delete(`${backendUrl}/${id}`).then((response) => response.data);

export default {
    getAll, create, update, del
};
