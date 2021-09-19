import axios from 'axios';
const backendUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(backendUrl).then(response => response.data);
}

const create = (newPerson) => {
    return axios.post(backendUrl, newPerson).then(response => response.data);
}

const update = (id, updatedPerson) => {
    return axios.put(`${backendUrl}/${id}`, updatedPerson).then(response => response.data);
}

const del = (id) => {
    return axios.delete(`${backendUrl}/${id}`).then(response => response.data);
}

export default { getAll, create, update, del }