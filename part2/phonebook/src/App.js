import React, { useEffect, useState } from 'react';
import backend from './backend';
import './App.css';

const Error = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className="error">
            {message}
      </div>
    );
};

const Notification = ({ message }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className="notification">
            {message}
      </div>
    );
};

const DisplayPerson = ({ person, onDeletePerson }) => (
  <div>
      {person.name}
      {' '}
      {person.number}
      {' '}
      <button onClick={() => onDeletePerson(person)}>delete</button>
    </div>
);

const DisplayPhoneBook = ({ shownPeople, onDeletePerson }) => (
  <div>
      {shownPeople.map((person) => <DisplayPerson person={person} key={person.id} onDeletePerson={onDeletePerson} />)}
    </div>
);

const Filter = ({ filterName, onFilterNameChange }) => (
  <div>
      filter names <input value={filterName} onChange={onFilterNameChange} />
    </div>
);

const PhonebookForm = ({
    newName, onNameChange, newNumber, onNumberChange, onAddName
}) => (
  <div>
      <form onSubmit={onAddName}>
          <div>
              name: <input value={newName} onChange={onNameChange} />
            </div>
          <div>
              number: <input type="tel" value={newNumber} onChange={onNumberChange} />
            </div>
          <div>
              <button type="submit">add</button>
            </div>
        </form>
    </div>
);

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filterName, setNewFilterName] = useState('');
    const [notification, setNotification] = useState(null);
    const [errorMessage, setNewErrorMessage] = useState(null);
    const [notificationTimeout, setNotificationTimeout] = useState(null);
    const [errorTimeout, setErrorTimeout] = useState(null);

    useEffect(() => {
        backend.getAll().then((persons) => {
            setPersons(persons);
        });
    }, []);

    function addError(message) {
        setNewErrorMessage(message);

        if (errorTimeout !== null) {
            clearTimeout(errorTimeout);
            setErrorTimeout(null);
        }

        setErrorTimeout(setTimeout(() => {
            setNewErrorMessage(null);
            setErrorTimeout(null);
        }, 3000));
    }

    function addNotification(message) {
        setNotification(message);

        if (notificationTimeout !== null) {
            clearTimeout(notificationTimeout);
            setNotificationTimeout(null);
        }

        setNotificationTimeout(setTimeout(() => {
            setNotification(null);
            setNotificationTimeout(null);
        }, 3000));
    }

    function onAddName(event) {
        event.preventDefault();

        const person = {
            name: newName,
            number: newNumber
        };
        const foundPerson = persons.find((p) => p.name === person.name);

        if (foundPerson !== undefined) {
            const newPerson = { ...foundPerson, number: newNumber };
            backend.update(foundPerson.id, newPerson).then((newPerson) => {
                setPersons(persons.map((p) => (p.id === newPerson.id ? newPerson : p)));
                addNotification(`Successfully updated ${newPerson.name}!`);

                setNewName('');
                setNewNumber('');
            })
                .catch((error) => {
                    addError(`Error while updating info of ${person.name}! ${error.response.data.error}`);
                });
        } else {
            backend.create(person).then((newPerson) => {
                setPersons(persons.concat(newPerson));
                addNotification(`Successfully added ${newPerson.name}!`);

                setNewName('');
                setNewNumber('');
            })
                .catch((error) => {
                    addError(`Error while adding ${person.name}! ${error.response.data.error}`);
                });
        }
    }

    function onDeletePerson(person) {
        if (window.confirm(`Delete ${person.name}?`)) {
            backend.del(person.id).then((result) => {
                setPersons(persons.filter((p) => p.id !== person.id));
                addNotification(`Successfully deleted ${person.name}!`);
            })
                .catch((error) => {
                    setPersons(persons.filter((p) => p.id !== person.id));
                    addError(`Cannot delete ${person.name}, it's probably already deleted! ${error.response.data.error}`);
                });
        }
    }

    function onFilterNameChange(event) {
        setNewFilterName(event.target.value);
    }

    function onNameChange(event) {
        setNewName(event.target.value);
    }

    function onNumberChange(event) {
        setNewNumber(event.target.value);
    }

    const shownPeople = filterName === ''
        ? persons
        : persons.filter((person) => person.name.toLowerCase().includes(filterName.toLowerCase()));

    return (
        <div>
            <Error message={errorMessage} />
            <Notification message={notification} />
            <h2>Phonebook</h2>
            <PhonebookForm
            newName={newName} onNameChange={onNameChange}
            newNumber={newNumber} onNumberChange={onNumberChange}
            onAddName={onAddName}
          />

            <Filter filterName={filterName} onFilterNameChange={onFilterNameChange} />

            <h2>Numbers</h2>

            <DisplayPhoneBook shownPeople={shownPeople} onDeletePerson={onDeletePerson} />
      </div>
    );
};

export default App;
