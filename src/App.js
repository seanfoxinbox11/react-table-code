import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';

// • A user should be able to see a table with the name, city, state, phone number, and genres for each restaurant.
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

  const [filterOptions, setFilterOptions] = useState(null);

  useEffect(() => {

    // load restaurant data
    fetch('https://code-challenge.spectrumtoolbox.com/api/restaurants', {
      headers: {
        Authorization: 'Api-Key q3MNxtfep8Gt',
      },
    })
      .then((response) => response.json())
      .then((restaurants) => {
        console.log(restaurants);

        const headingKeys = Object.keys(restaurants[0]);
        //console.log("headingKeys", headingKeys)

        const includedHeadings = desiredHeadings.filter((desiredHeading) => {
          return !!headingKeys.find(key => desiredHeading.dataProperty === key);
        })

        //console.log("includedHeadings", includedHeadings)

        setHeadings(includedHeadings);

         // • A user should see results sorted by name in alphabetical order starting with the beginning of the alphabet
        setRestaurants(getSortRestaurants(restaurants, "name", 1));
      });
  }, []);

  const getSortRestaurants = (restaurants, key, direction) => {

    const clonedRestaurants = [...restaurants];
    return clonedRestaurants.sort((a, b) => { 
        let valueA = a[key].toUpperCase();
        let valueB = b[key].toUpperCase(); 
        if (valueA < valueB) {
          return -direction;
        }
        if (valueA > valueB) {
          return direction;
        }

        // names are equal
        return 0;

    });

  }


  useEffect(() => {
      let filteredRestaurants = restaurants?.filter(restaurant => {
        let matchesFilter = true;
        return matchesFilter;
      });

      // isFilterable

      let filterOptions = {
      };

      const filterableHeadings = headings?.filter(heading => heading.isFilterable);
      filterableHeadings.forEach(({dataProperty}) => {
        //heading.dataProperty;
        if(!filterOptions[dataProperty]){ 
          filterOptions[dataProperty] = []; 
        }

        filteredRestaurants.forEach(restaurant => {
          let values = restaurant[dataProperty].split(',');
          values.forEach(value => filterOptions[dataProperty].find(filterOption => value.toLowerCase() === filterOption.toLowerCase()) || filterOptions[dataProperty].push(value))
        });
      })
      
      console.log({filterOptions})
      setFilterOptions(filterOptions);

      
      // TODO: get only results for this page with .slice

      ////[filterResults] //which are set in the state
      setFilteredRestaurants(filteredRestaurants);
    }

  , [restaurants, headings, filter.genre, filter.text, filter.page]
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
                           {
                              filterOptions && filterOptions[heading.dataProperty].map((option) => {
                                return <option key={option} value={option}>{option}</option>
                              }) 
                            }
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
            filteredRestaurants?.map((restaurant) => {
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
