import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';


const desiredHeadings = [
  { dataProperty: "name", isFilterable: false },
  { dataProperty: "city", isFilterable: false },
  { dataProperty: "state", isFilterable: true },
  { dataProperty: "telephone", isFilterable: false },
  { dataProperty: "genre", isFilterable: true },
  { dataProperty: "attire", isFilterable: true },
];


function App() {

  const [filter, setFilter] = useState({
    genre: null,
    text: '',
    page: 1,
  });

  const [headings, setHeadings] = useState(null);
  const [restaurants, setRestaurants] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState(null);

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

        const headingKeys = Object.keys(restaurants[0]);
        //console.log("headingKeys", headingKeys)

        const includedHeadings = desiredHeadings.filter((desiredHeading) => {
          return !!headingKeys.find(key => desiredHeading.dataProperty === key);
        })

        //console.log("includedHeadings", includedHeadings)

        setHeadings(includedHeadings);

        setRestaurants(restaurants);
      });
  }, []);


  useEffect(() => {
    if (restaurants) {
      let filteredResults = restaurants.filter(restaurant => {
        let matchesFilter = true;
        return matchesFilter;
      });
      // TODO: get only results for this page with .slice

      ////[filterResults] //which are set in the state
      setFilteredRestaurants(filteredResults);
    }

  },
    [filter.genre, filter.text, filter.page]
  );


  return (
    <div className="App">

      <table>
        <thead>
          <tr className="table-heading">
            {
              headings?.map((heading) => {
                return <td key={heading.dataProperty}>{heading.dataProperty}</td>
              })
            }
          </tr>
        </thead>

        <tbody>
          <tr className="table-row">
            {
              headings?.map((heading) => {
                return (
                  <td key={heading.dataProperty}>

                    {
                      heading.isFilterable ?

                        <select>
                          <option value={"test"}>test</option>

                          {/* a.map((aO) => {
                          <option key={aO.dataProperty} value={aO}>{aO}</option>
                          }) */}
                        </select>

                        :
                        null

                    }
                  </td>
                )
              })
            }
          </tr>
        </tbody>

        <tbody>
          {
            restaurants?.map((restaurant) => {
              return (
                <tr key={restaurant.id} className="table-row">
                  {
                    headings.map((heading) => {
                      return <td key={heading.dataProperty}>{restaurant[heading.dataProperty]}</td>
                    })
                  }
                </tr>)
            })
          }
        </tbody>

      </table>
    </div>
  );
}
export default App;
