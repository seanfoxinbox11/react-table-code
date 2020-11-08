import { useState } from 'react';
import { useEffect } from 'react';
import './Table.css';




function Table(props) {

  const [filter, setFilter] = useState({
    text: "",
    page: 1,
  });

  
  

  const {headingData, rows} = props;

  const [headings, setHeadings] = useState(null);

  const [filteredRows, setFilteredRows] = useState(null);

  const [filterOptions, setFilterOptions] = useState(null);


  const [filtersEnabled, setFiltersEnabled] = useState(true);
  
  useEffect(() => {
    if (rows) {

      const headingKeys = Object.keys(rows[0]);
        const includedHeadings = headingData.filter((headingData) => {
          return !!headingKeys.find(key => headingData.dataProperty === key);
        });  
        //console.log("includedHeadings", includedHeadings)


        setHeadings(includedHeadings);
    }
                 
  }, [rows]);

  const getSortRows = (rows, key, direction) => {

    const clonedRows = [...rows];
    return clonedRows.sort((a, b) => { 
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

    if(!headings || !rows) return; // escape out of useEffect

    console.log(headings, rows);



    const sortByHeading = headings.find((heading) => {
      return !!heading.sortBy;
    });
     // • A user should see results sorted by name in alphabetical order starting with the beginning of the alphabet
    const sortedRows = getSortRows(rows, sortByHeading.dataProperty, 1);

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

    const searchableHeadings = headings?.filter(heading => heading.isSearchable);

    const filterTextToLower = searchableHeadings?.length && filter.text.toLowerCase().trim();

    let filteredRows = sortedRows?.filter(rowData => {
      if(!filtersEnabled) {
        return true; // escape out of useEffect
      }

      if(filterTextToLower){
        
        const matchesText = searchableHeadings.find(({dataProperty}) => {
          return rowData[dataProperty].toLowerCase().includes(filterTextToLower);
        });
        if(!matchesText) return false;

     


      }

      for(let heading of filterableHeadings){
        const {dataProperty} = heading;
        const filterValue = filter[dataProperty];
        if(filterValue != 'All'){
          const cellValues = rowData[dataProperty].split(',');
          const matches = cellValues.find(cellValue => cellValue.toLowerCase()===filterValue.toLowerCase());
          if(!matches) {
            return false;
          }
        }
      }
      return true;
    });
    setFilteredRows(filteredRows);


    let filterOptions = {};   
    filterableHeadings?.forEach(({dataProperty}) => {
      //heading.dataProperty;
      if(!filterOptions[dataProperty]){ 
        filterOptions[dataProperty] = ['All']; 
      }

      filteredRows?.forEach(rowData => {
        let values = rowData[dataProperty].split(',');
        values.forEach(value => filterOptions[dataProperty].find(filterOption => value.toLowerCase() === filterOption.toLowerCase()) || filterOptions[dataProperty].push(value))
      });
    });
    setFilterOptions(filterOptions);

      
    // TODO: get only results for this page with .slice

    ////[filterResults] //which are set in the state

  
  }, [rows, headings, filter, filtersEnabled]);


  useEffect(() => {

    setFilter(filter => ({...filter,
      text: props.filterText
    }))

  }, [props.filterText]);



  const onFiltersCheckBoxChange = (event) => {
    setFiltersEnabled(event.target.checked);
  }

  return (
    <div>
      <label><input type="checkbox" checked={filtersEnabled} onChange={onFiltersCheckBoxChange}/> Enable Filters </label>
      


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
    </div>
  );
}
export default Table;
