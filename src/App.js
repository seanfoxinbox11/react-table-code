import { useEffect, useState } from 'react';
import Table from './components/Table';
import TextFieldSubmit from './components/TextFieldSubmit';
import './components/Table.css';


/** 
* Table Configuration objects array.
* The Table component uses data for its configuration of which headings to display, filter, search on and sort by
* so that it is customizable and not hard coded for the code challenge.
*/
const headingData = [
  { dataProperty: "name", isFilterable: false, isSearchable: true, isSortable: true, defaultSortBy: true},
  { dataProperty: "city", isFilterable: false, isSearchable: true, isSortable: false},
  { dataProperty: "state", isFilterable: true, isSearchable: false, isSortable: true},
  { dataProperty: "telephone", isFilterable: false, isSearchable: false, isSortable: false},
  { dataProperty: "genre", isFilterable: true, isSearchable: true, isSortable: false},
  { dataProperty: "attire", isFilterable: true, isSearchable: false, isSortable: false},
];

const urlInfo = { url: 'https://code-challenge.spectrumtoolbox.com/api/restaurants', authorization: 'Api-Key q3MNxtfep8Gt' };


function App() {

  const [restaurants, setRestaurants] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Load restaurant data
    fetch(urlInfo.url, {
      headers: {
        Authorization: urlInfo.authorization,
      },
    })
      .then((response) => response.json())
      .then((restaurants) => {
        setRestaurants(restaurants);

        console.log(restaurants);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


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
        headingData={headingData}
        rows={restaurants}
        filterText={searchText}
      />
    </div>
  );
}
export default App;