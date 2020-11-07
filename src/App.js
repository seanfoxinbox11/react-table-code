import { useEffect, useState } from 'react';
import Table from './components/Table';


// • A user should be able to see a table with the name, city, state, phone number, and genres for each restaurant.
const desiredHeadings = [
  { dataProperty: "name", isFilterable: false, sortBy: true},
  { dataProperty: "city", isFilterable: false },
  { dataProperty: "state", isFilterable: true },
  { dataProperty: "telephone", isFilterable: false },
  { dataProperty: "genre", isFilterable: true },
  { dataProperty: "attire", isFilterable: true },
];


function App() {

  const [restaurants, setRestaurants] = useState(null);

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

  return (
    <div>
      <Table desiredHeadings={desiredHeadings} restaurants={restaurants} />
    </div>
  );
}
export default App;
