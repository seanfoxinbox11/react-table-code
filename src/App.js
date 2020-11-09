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
  { dataProperty: "name", isFilterable: false, isSearchable: true, sortBy: true },
  { dataProperty: "city", isFilterable: false, isSearchable: true, },
  { dataProperty: "state", isFilterable: true },
  { dataProperty: "telephone", isFilterable: false },
  { dataProperty: "genre", isFilterable: true, isSearchable: true, },
  { dataProperty: "attire", isFilterable: true },
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




// Charter/Spectrum Front-End Code Challenge

// For this challenge we would like you to create a React application that pulls restaurant data from a simple REST API, displays
// that data in a table, and allows users to filter that data.
// API Endpoint: https://code-challenge.spectrumtoolbox.com/api/restaurants
// API Key Header: Authorization | Api-Key q3MNxtfep8Gt
// Example Fetch:
// fetch(“https://code-challenge.spectrumtoolbox.com/api/restaurants”, {
//  headers: {
//  Authorization: “Api-Key q3MNxtfep8Gt”,
//  },
// });

// User stories are as follows:
// • A user should be able to see a table with the name, city, state, phone number, and genres for each restaurant.
// • A user should see results sorted by name in alphabetical order starting with the beginning of the alphabet
// • A user should be able to filter restaurants by state.
// • A user should be able to filter by genre.
// • Add filter for attire
// • State and Genre filters should default to “All” and take effect instantaneously (no additional clicks).
// • A user should be able to enter text into a search field. When hitting the enter key or clicking on a search
// button, the table should search results. Search results should match either the name, city, or genre.
// • A user should be able to clear the search by clearing the text value in the search input.
//• A user should be able to combine filters and search. The user should be able to turn filters on and off while a
  // search value is present.

// What we are looking for:
// • No use of third-party component libraries for the table/filter/search.
// • Using Create-React-App or Next.js as a starter kit is okay.
// • Sound logic for how the filters are architected
// • Descriptive naming conventions
// • DRY code that is readable and production ready
// • Well organized file structure
// • Styling follows a convention/pattern and is well organized
// • Reusable components

// Stretch goals:
// • Table row click shows additional information
// • User can sort the data by name and state
// • Feel free to get creative!
// • CI / CD
// • Unit tests
// • TypeScript
////////////////////////////////













// QA functionality per bullet at the end, qa code for mutation and dependencies



// put comments at the bottom here saying which featur bullets are included
// Clean/ Comment

// • Full Git history with atomic commits
// • Deployed application


/////////////////////////