import { useEffect, useState } from 'react';
import SearchableTable from './components/SearchableTable';

/** 
* Table Configuration objects array.
* The Table component uses data for its configuration of which headings to display, filter, search on and sort by
* so that it is customizable and not hard coded for the code challenge.
*/
const headingDataForCodeChallenge = [
  { dataProperty: "name", isFilterable: false, isSearchable: true, isSortable: true, defaultSortBy: true},
  { dataProperty: "city", isFilterable: false, isSearchable: true, isSortable: false},
  { dataProperty: "state", isFilterable: true, isSearchable: false, isSortable: true},
  { dataProperty: "telephone", isFilterable: false, isSearchable: false, isSortable: false},
  { dataProperty: "genre", isFilterable: true, isSearchable: true, isSortable: false},
  { dataProperty: "attire", isFilterable: true, isSearchable: false, isSortable: false},
];


/** 
* Table Configuration objects array for the second table
*/
const headingDataForAlternateTable = [
  { dataProperty: "name", isFilterable: true, isSearchable: true, isSortable: true, defaultSortBy: true},
  { dataProperty: "website", isFilterable: false, isSearchable: true, isSortable: false},
  { dataProperty: "hours", isFilterable: false, isSearchable: true, isSortable: true},
  { dataProperty: "telephone", isFilterable: false, isSearchable: false, isSortable: false},
];


const urlInfo = { url: 'https://code-challenge.spectrumtoolbox.com/api/restaurants', authorization: 'Api-Key q3MNxtfep8Gt' };

function App() {

  const [restaurants, setRestaurants] = useState(null);

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

  return (
    <div>
      <SearchableTable
        headingData={headingDataForCodeChallenge}
        rows={restaurants}
      />

      <SearchableTable
        headingData={headingDataForAlternateTable}
        rows={restaurants}
      />
    </div>
  );
}
export default App;