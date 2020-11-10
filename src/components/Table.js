import { useEffect, useState } from 'react';

/** 
* Table functional component
* @param {object} props - object with values passed in as props
*/
function Table(props) {

  const { headingData, rows, filterText } = props;
  const [headings, setHeadings] = useState(null);

  const [filteredRows, setFilteredRows] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);
  const defaultFilterOptionValue = "All";
  const [filteredRowsLength, setFilteredRowsLength] = useState(0);
  const [filterHeadingsEnabled, setFilterHeadingsEnabled] = useState(0);
  const [filter, setFilter] = useState({
    text: "",
  });

  const [pagination, setPagination] = useState(1);
  const resultMax = 10;

  /** 
  * Set table headings when row prop updates
  */
  useEffect(() => {
    // set headings
    if (rows) {
      const headingKeys = Object.keys(rows[0]);
      const includedHeadings = headingData.filter((headingData) => {
        return !!headingKeys.find(key => headingData.dataProperty === key);
      });
      //console.log("includedHeadings",includedHeadings);

      setHeadings(includedHeadings);
    }
  }, [rows, headingData]);


  useEffect(() => {
    const filterableHeadings = headings?.filter(heading => heading.isFilterable);

    const filtersEnabled = {};
    if (filterableHeadings) {
      filterableHeadings.forEach(({ dataProperty }) => {
        filtersEnabled[dataProperty] = true;
      });
    }

    setFilterHeadingsEnabled(filtersEnabled);

  }, [headings]);


  useEffect(() => {
    const filterableHeadings = headings?.filter(heading => heading.isFilterable);

    // Set Filter options default values
    // • State and Genre filters should default to “All” and take effect instantaneously (no additional clicks).
    if (filterableHeadings && !filter[filterableHeadings[0].dataProperty]) {
      setFilter(filter => {
        let filterDefaults = {};
        filterableHeadings.forEach(({ dataProperty }) => {
          if (!filter[dataProperty]) filterDefaults[dataProperty] = defaultFilterOptionValue;
        });
        return { ...filter, ...filterDefaults };
      });
    }

    // Set filter option values
    let filterOptions = {};
    filterableHeadings?.forEach(({ dataProperty }) => {
      if (!filterOptions[dataProperty]) {
        filterOptions[dataProperty] = [];
      }

      rows?.forEach(rowData => {
        let values = rowData[dataProperty].split(',');
        values.forEach(value => filterOptions[dataProperty].find(filterOption => value.toLowerCase() === filterOption.toLowerCase()) || filterOptions[dataProperty].push(value))
      });

      // Sort filter options
      filterOptions[dataProperty].sort();

      filterOptions[dataProperty].unshift(defaultFilterOptionValue);
    });

    setFilterOptions(filterOptions);
  }, [rows, headings]);


  useEffect(() => {
    const filterableHeadings = headings?.filter(heading => heading.isFilterable);

    if (!filterableHeadings) { return }

    if (!headings || !rows || !filter || !filter[filterableHeadings[0].dataProperty]) return; // escape useEffect

    const sortedRows = getSortedRows(rows, headings, 1);

    // • Search results should match either the name, city, or genre.
    // • A user should be able to clear the search by clearing the text value in the search input.
    let filteredRows = sortedRows?.filter(rowData => {
      const searchableHeadings = headings?.filter(heading => heading.isSearchable);
      const filterTextToLower = searchableHeadings?.length && filter.text.toLowerCase().trim();
      if (filterTextToLower) {
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

        if (filterValue != defaultFilterOptionValue && filterHeadingsEnabled[dataProperty]) {
          const cellValues = rowData[dataProperty].split(',');
          const matches = cellValues.find(cellValue => cellValue.toLowerCase() === filterValue.toLowerCase());
          if (!matches) {
            return false;
          }
        }
      }
      return true;
    });


    // • A user should only see 10 results at a time and the table should be paginated.
    const paginationStart = (pagination * resultMax) - resultMax;
    const paginationEnd = paginationStart + resultMax;

    const paginatedRows = filteredRows.slice(paginationStart, paginationEnd);

    setFilteredRowsLength(filteredRows.length);

    setFilteredRows(paginatedRows);

  }, [rows, headings, filter, pagination, filterHeadingsEnabled]);


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
  const getSortedRows = (rows, headings, direction) => {
    // • A user should see results sorted by name in alphabetical order starting with the beginning of the alphabet
    const sortByHeading = headings.find((heading) => {
      return !!heading.sortBy;
    });

    return getdSortedClonedArray(rows, sortByHeading.dataProperty, direction);
  }

  const getdSortedClonedArray = (array, key, direction) => {
    const clonedArray = [...array];
    return clonedArray.sort((itemA, itemB) => {
      let valueA = itemA[key].toUpperCase();
      let valueB = itemB[key].toUpperCase();

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
    setFilter(argFilter => ({
      ...argFilter,
      [dataProperty]: event.target.value
    }));
  }


  const onPaginationButtonClick = (direction) => (event) => {

    const paginationMin = 1;
    const paginationMax = filteredRowsLength / resultMax;
    const incrementedPagination = pagination + direction;

    if (direction === -1 && pagination > 1 || direction === 1 && pagination < paginationMax) {
      setPagination(incrementedPagination);
    }
  }

  const onFiltersCheckBoxChange = (dataProperty) => {
    return (event) => {
      // • A user should be able to combine filters and search. The user should be able to turn filters on and off while a search value is present.

      setPagination(1);
      
      setFilterHeadingsEnabled(filterHeadingsEnabled => ({
        ...filterHeadingsEnabled, [dataProperty]: event.target.checked
      })
      )
    }
  }

  const numberOfPages = Math.ceil(filteredRowsLength / resultMax);

  // • A user should be able to see a table with the name, city, state, phone number, and genres for each restaurant.
  // • If any of the filters do not return any restaurants, the UI should indicate that no results were found.

  return (
    <div>
      <table>
        <thead>
          <tr>
            {
              headings?.map((heading) => {
                return <td key={heading.dataProperty}>{heading.dataProperty}</td>
              })
            }
          </tr>
          <tr>
            {
              headings?.map(({ dataProperty, isFilterable }) => {
                return (
                  <td key={dataProperty}>
                    {
                      isFilterable && filter[dataProperty] ?
                        <div>
                          <select value={filter[dataProperty]} disabled={!filterHeadingsEnabled[dataProperty]} onChange={(event) => { applyFilter(event, dataProperty) }}>
                            {
                              filterOptions && filterOptions[dataProperty]?.map((option) => {
                                return <option key={option} value={option}>{option}</option>
                              })
                            }
                          </select>

                          <input
                            type="checkbox"
                            checked={filterHeadingsEnabled[dataProperty]}
                            onChange={onFiltersCheckBoxChange(dataProperty)}
                          />
                        </div>
                        :
                        null
                    }
                  </td>
                )
              })
            }
          </tr>
        </thead>

        <tbody>
          {
            filteredRows?.map((rowData) => {
              return (
                <tr key={rowData.id} className="table-row">
                  {
                    headings.map((heading) => {
                      return <td key={heading.dataProperty}><span>{rowData[heading.dataProperty]}</span></td>
                    })
                  }
                </tr>)
            })
          }
        </tbody>

        <tfoot>
          {!filteredRowsLength ?
            <tr><td>"No results were found."</td></tr>
            :
            null
          }

          {
            numberOfPages > 1 ?
              <div>
                Page {pagination} of {numberOfPages} <button onClick={onPaginationButtonClick(-1)}>Previous</button>
                <button onClick={onPaginationButtonClick(1)}>Next</button>
              </div>
              :
              null
          }
        </tfoot>
      </table>

    </div>
  );
}
export default Table;