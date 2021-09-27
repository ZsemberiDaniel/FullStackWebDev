import React from 'react';
import { changeFilter } from './../reducers/filterReducer';
import { connect } from 'react-redux';

const Filter = (props) => {
    const filterValue = props.filter;
    const handleChange = (event) => {
        props.changeFilter(event.target.value);
    };
    const style = {
        marginBottom: 10
    };

    return (
        <div style={style}>
            filter <input value={filterValue} onChange={handleChange} />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        filter: state.filter
    }
};

const mapDispatchToProps = {
    changeFilter
};

export default connect(
    mapStateToProps, mapDispatchToProps
)(Filter);