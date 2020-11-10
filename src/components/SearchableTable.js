import { useState } from 'react';
import Table from './Table';
import TextFieldSubmit from './TextFieldSubmit';
import './Table.css';


function SearchableTable(props) {

  const [searchText, setSearchText] = useState("");

  /** 
  * Updates the searchText in the state with text from the TextField
  */
  const onSearchSubmit = (text) => {
    setSearchText(text);
  }

  return (
    <div className="table-container">
      <TextFieldSubmit submitCallback={onSearchSubmit} />

      <Table
        headingData={props.headingData}
        rows={props.rows}
        filterText={searchText}
      />
    </div>
  );
}
export default SearchableTable;