import { useEffect, useState } from 'react';
import Table from './components/Table';
import TextField from './components/TextFieldSubmit';


// • A user should be able to see a table with the name, city, state, phone number, and genres for each restaurant.
const headingData = [
  { dataProperty: "name", isFilterable: false, isSearchable: true, sortBy: true},
  { dataProperty: "city", isFilterable: false, isSearchable: true, },
  { dataProperty: "state", isFilterable: true },
  { dataProperty: "telephone", isFilterable: false },
  { dataProperty: "genre", isFilterable: true, isSearchable: true, },
  { dataProperty: "attire", isFilterable: true },
];


function App() {

  const [restaurants, setRestaurants] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {

      // load restaurant data
      fetch('https://code-challenge.spectrumtoolbox.com/api/restaurants', {
        headers: {
          Authorization: 'Api-Key q3MNxtfep8Gt',
        },
      })
        .then((response) => response.json())
        .then((restaurants) => {
          //console.log(restaurants);
  
          setRestaurants(restaurants);     
        });

  }, []);


  const onSearchSubmit = (text) => {
    setSearchText(text);
  }

  return (
    <div>
      <TextField submitCallback={onSearchSubmit} />
      <Table headingData={headingData} restaurants={restaurants} filterText={searchText} />
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
// • A user should be able to combine filters and search. The user should be able to turn filters on and off while a
// search value is present.

// What we are looking for:
// • No use of third-party component libraries for the table/filter/search.
// • Using Create-React-App or Next.js as a starter kit is okay.
// • Sound logic for how the filters are architected

// Stretch goals:
// • Table row click shows additional information
// • User can sort the data by name and state
// • Feel free to get creative!
// • CI / CD
// • Unit tests
// • TypeScript
////////////////////////////////



// • If any of the filters do not return any restaurants, the UI should indicate that no results were found.

// • A user should only see 10 results at a time and the table should be paginated.




// What we are looking for:
// • Reusable components
// • Descriptive naming conventions
// • DRY code that is readable and production ready
//  Commenting
// • Well organized file structure
// • Styling follows a convention/pattern and is well organized
// • Full Git history with atomic commits
// • Deployed application


/////////////////////////