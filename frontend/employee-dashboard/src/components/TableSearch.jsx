import { TextField } from '@mui/material';
import { useState } from 'react';


const TableSearch = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    onSearch(value);
  };

  return (
    <TextField
      id="search"
      label="Find employee"
      variant="standard"
      value={searchText}
      onChange={handleSearchChange}
    />
  )
}

TableSearch.propTypes = {};
TableSearch.defaultProps = {};

export default TableSearch;