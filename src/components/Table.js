import { useEffect, useState } from 'react';
import './Table.css';

/** 
* Table functional component
* @param {object} props - object with values passed in as props
*/
function Table(props) {

  const { headingData, rows, filterText, filtersEnabled } = props;
  const [headings, setHeadings] = useState(null);
  const [filteredRows, setFilteredRows] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);

  const [filter, setFilter] = useState({
    text: "",
    page: 1,
  });

  const defaultFilterValue = "All";


  /** 
  * Initialize table headings when row prop updates
  */
  useEffect(() => {
    initHeadings();
  }, [rows]);

  const initHeadings = () => {
    if (rows) {
      const headingKeys = Object.keys(rows[0]);
      const includedHeadings = headingData.filter((headingData) => {
        return !!headingKeys.find(key => headingData.dataProperty === key);
      });

      setHeadings(includedHeadings);
    }
  }




  useEffect(() => {

    if (!headings || !rows) return; // escape useEffect
   
    const sortedRows = getSortRows(rows, 1);
   
    const filterableHeadings = headings?.filter(heading => heading.isFilterable);

    // Set Filter Default Values
    // • State and Genre filters should default to “All” and take effect instantaneously (no additional clicks).
    if (filterableHeadings && !filter[filterableHeadings[0].dataProperty]) {
      setFilter(filter => {
        let filterDefaults = {};
        filterableHeadings.forEach(({ dataProperty }) => {
          if (!filter[dataProperty]) filterDefaults[dataProperty] = defaultFilterValue;
        });
        return { ...filter, ...filterDefaults };
      });
      return; // escape useEffect
    }

    

    const searchableHeadings = headings?.filter(heading => heading.isSearchable);

    const filterTextToLower = searchableHeadings?.length && filter.text.toLowerCase().trim();

    let filteredRows = sortedRows?.filter(rowData => {
      if (!filtersEnabled) {
        return true; // escape useEffect
      }

      if (filterTextToLower) {      
        // • Search results should match either the name, city, or genre.
        // • A user should be able to clear the search by clearing the text value in the search input.
        const matchesText = searchableHeadings.find(({ dataProperty }) => {
          return rowData[dataProperty].toLowerCase().includes(filterTextToLower);
        });
        if (!matchesText) return false;
      }


      // • A user should be able to filter restaurants by state
      // • A user should be able to filter by genre.
      // • Add filter for attire
      for (let heading of filterableHeadings) {
        const { dataProperty } = heading;
        const filterValue = filter[dataProperty];
        if (filterValue != defaultFilterValue) {
          const cellValues = rowData[dataProperty].split(',');
          const matches = cellValues.find(cellValue => cellValue.toLowerCase() === filterValue.toLowerCase());
          if (!matches) {
            return false;
          }
        }
      }
      return true;
    });
    setFilteredRows(filteredRows);



    let filterOptions = {};
    filterableHeadings?.forEach(({ dataProperty }) => {
      //heading.dataProperty;
      if (!filterOptions[dataProperty]) {
        filterOptions[dataProperty] = [defaultFilterValue];
      }

      filteredRows?.forEach(rowData => {
        let values = rowData[dataProperty].split(',');
        values.forEach(value => filterOptions[dataProperty].find(filterOption => value.toLowerCase() === filterOption.toLowerCase()) || filterOptions[dataProperty].push(value))
      });
    });
    setFilterOptions(filterOptions);


    // TODO: get only results for this page with .slice

    ////[filterResults] //which are set in the state


  }, [headings, filter, filtersEnabled]);


  /** 
  * Updates the text property on filter state property
  */
  useEffect(() => {

    setFilter(filter => ({
      ...filter,
      text: filterText
    }))

  }, [filterText]);


  /** 
  * Returns a cloned array of the rows sorted by on specific property
  * @param {array} rows - row datas to be sorted
  * @param {number} direction - the direction in which to sort the rows take 1 or -1
  */
  const getSortRows = (rows, direction) => {
    // • A user should see results sorted by name in alphabetical order starting with the beginning of the alphabet
    const sortByHeading = headings.find((heading) => {
      return !!heading.sortBy; 
    });    

    const clonedRows = [...rows];
    return clonedRows.sort((rowA, rowB) => {
      let valueA = rowA[sortByHeading.dataProperty].toUpperCase();
      let valueB = rowB[sortByHeading.dataProperty].toUpperCase();
     
      if (valueA < valueB) {
        return -direction;
      }
      if (valueA > valueB) {
        return direction;
      }

      return 0; // the values are equal
    });
  }


  /** 
  * Updates the specific filter state value which the ui select is associated with.  
  * @param {event} event - the event which triggered the call
  * @param {string} dataProperty - the name of the property which is being filtered on
  */
  const applyFilter = (event, dataProperty) => {

    console.log(dataProperty)
      setFilter(filter => ({
        ...filter,
        [dataProperty]: event.target.value
      }))
  }

  // • A user should be able to see a table with the name, city, state, phone number, and genres for each restaurant.

  return (
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
          headings?.map(({ dataProperty, isFilterable }) => {
            return (
              <td key={dataProperty}>
              {
                isFilterable && filter[dataProperty] && filtersEnabled ?
                  
                  <select value={filter[dataProperty]} onChange={(event)=>{ applyFilter(event, dataProperty) }}>
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
        filteredRows?.map((rowData) => {
          return (
            <tr key={rowData.id} className="table-row">
            {
              headings.map((heading) => {
                return <td key={heading.dataProperty}>{rowData[heading.dataProperty]}</td>
              })
            }
            </tr>)
        })
      }
      </tbody>
    </table>
  );
}
export default Table;