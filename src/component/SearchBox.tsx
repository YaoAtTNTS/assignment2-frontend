import React from "react";
import '../App.css';
import Select from "react-dropdown-select"

interface Props {
    onSearch: () => void,
    onChange: (value) => void,
    options:{ value: string; label: string; }[],
    values: { value: string; label: string; }[],
    onSelect: (value) => void,
    isTabletOrMobile: boolean
}

function SearchBox({onSearch, onChange, values, options, onSelect, isTabletOrMobile}: Props) {

    return (
        <div className="search-box" style={{marginLeft:isTabletOrMobile?0:50}}>
            <Select style={{width:150, height:30}} values={values} options={options} onChange={onSelect}/>
            &nbsp;&nbsp;
            <input
                type="search"
                className="search-box-input"
                placeholder="Search here"
                onChange={onChange}
            />
            &nbsp;
            <button id="search_submit" className="search-box-icon" onClick={onSearch} >🔍</button>
        </div>
    )
}

export default SearchBox;

