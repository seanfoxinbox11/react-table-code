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
    const filterableHeadings = headings?.filter(heading => heading.isFilterable);
  
    let filteredRestaurants = restaurants?.filter(restaurant => {
      for(let heading of filterableHeadings){
        const {dataProperty} = heading;
        const filterValue = filter[dataProperty];
        if(filterValue!='All'){
          const restaurantValues = restaurant[dataProperty].split(',');
          const matches = restaurantValues.find(restaurantValue => restaurantValue.toLowerCase()===filterValue.toLowerCase());
          if(!matches) {
            return false;
          }
        }
      }
      return true;
    });


    let filterOptions = {};   
    filterableHeadings?.forEach(({dataProperty}) => {
      //heading.dataProperty;
      if(!filterOptions[dataProperty]){ 
        filterOptions[dataProperty] = ['All']; 
      }

      filteredRestaurants?.forEach(restaurant => {
        let values = restaurant[dataProperty].split(',');
        values.forEach(value => filterOptions[dataProperty].find(filterOption => value.toLowerCase() === filterOption.toLowerCase()) || filterOptions[dataProperty].push(value))
      });
    });

    // set filter defaults
    if(filterableHeadings && !filter[filterableHeadings[0].dataProperty] ){
      setFilter(filter => {
        let filterDefaults = {};
        filterableHeadings.forEach(({dataProperty}) => {
          if(!filter[dataProperty]) filterDefaults[dataProperty] = 'All';
        });
        return {...filter, ...filterDefaults};
      });
    }
      
    setFilterOptions(filterOptions);
    
    // TODO: get only results for this page with .slice

    ////[filterResults] //which are set in the state
    setFilteredRestaurants(filteredRestaurants);
  }, [restaurants, headings, filter]);


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
              headings?.map(({dataProperty, isFilterable}) => {
                return (
                  <td key={dataProperty}>

                    {
                      isFilterable && filter[dataProperty] ?

                        <select value={filter[dataProperty]} onChange={(event) => {
                          setFilter(filter => ({...filter,
                            [dataProperty]: event.target.value
                          }))
                        }}>
                           {
                              filterOptions && filterOptions[dataProperty]?.map((option) => {
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
