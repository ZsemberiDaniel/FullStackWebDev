import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries';
import Select from 'react-select';

const UpdateAuthors = (props) => {
    const [born, setBorn] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
    const selectOptions = props.authors.map(author => { return { value: author.name, label: author.name }; });

    const [ updateAuthor ] = useMutation(UPDATE_AUTHOR, {
        refetchQueries: [ { query: ALL_AUTHORS} ],
        onError: (error) => {
            props.notify(error.networkError.result.errors[0].message);
            // console.log(error.networkError.result.errors[0].message);
        }
    });

    if (!props.token) {
        return (
            <div>Login to edit authors!</div>
        )
    }

    const submit = (event) => {
        event.preventDefault();
        
        if (!selectedOption) {
            props.notify('Select something!');
            return;
        }
        updateAuthor({
            variables: { name: selectedOption.value, born: Number(born) }
        });

        setSelectedOption(null);
        setBorn('');
    };

    return (
        <div>
            <form onSubmit={submit}>
                <Select name='name' options={selectOptions} defaultValue={selectedOption} onChange={setSelectedOption} />
                born <input type="number" value={born} onChange={({ target }) => setBorn(target.value)} /> <br />
                <button type="submit">update author</button>
            </form>
        </div>
    );
};

export default UpdateAuthors;