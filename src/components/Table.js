import { useState } from 'react';
import { useEffect } from 'react';
import './Table.css';



function Table(props) {

  const [filter, setFilter] = useState({
    page: 1,
  });

  const {desiredHeadings, restaurants} = props;

  const [headings, setHeadings] = useState(null);
  //const [restaurants, setRestaurants] = useState(null);
  const [filteredRestaurants, setFilteredRestaurants] = useState(null);

  const [filterOptions, setFilterOptions] = useState(null);

  
  useEffect(() => {
    if (restaurants) {

      const headingKeys = Object.keys(restaurants[0]);
        const includedHeadings = desiredHeadings.filter((desiredHeading) => {
          return !!headingKeys.find(key => desiredHeading.dataProperty === key);
        });  
        //console.log("includedHeadings", includedHeadings)


        setHeadings(includedHeadings);
    }
                 
  }, [restaurants]);

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

    if(!headings || !restaurants) return; // escape out of useEffect

    console.log(headings, restaurants);



    const sortByHeading = headings.find((heading) => {
      return !!heading.sortBy;
    });
     // • A user should see results sorted by name in alphabetical order starting with the beginning of the alphabet
    const sortedRestaurants = getSortRestaurants(restaurants, sortByHeading.dataProperty, 1);

    const filterableHeadings = headings?.filter(heading => heading.isFilterable);

    // set filter defaults
    if(filterableHeadings && !filter[filterableHeadings[0].dataProperty] ){
      setFilter(filter => {
        let filterDefaults = {};
        filterableHeadings.forEach(({dataProperty}) => {
          if(!filter[dataProperty]) filterDefaults[dataProperty] = 'All';
        });
        return {...filter, ...filterDefaults};
      });
      return; // escape out of useEffect
    }

    
  
    let filteredRestaurants = sortedRestaurants?.filter(restaurant => {
      for(let heading of filterableHeadings){
        const {dataProperty} = heading;
        const filterValue = filter[dataProperty];
        if(filterValue != 'All'){
          const restaurantValues = restaurant[dataProperty].split(',');
          const matches = restaurantValues.find(restaurantValue => restaurantValue.toLowerCase()===filterValue.toLowerCase());
          if(!matches) {
            return false;
          }
        }
      }
      return true;
    });
    setFilteredRestaurants(filteredRestaurants);


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
    setFilterOptions(filterOptions);

      
    // TODO: get only results for this page with .slice

    ////[filterResults] //which are set in the state

  
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
export default Table;
