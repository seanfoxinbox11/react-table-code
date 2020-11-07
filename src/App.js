import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';


const headings = [
  { label: "Name", dataProperty: "name" },
  { label: "Address", dataProperty: "address1" },
  { label: "City", dataProperty: "city" },
  { label: "State", dataProperty: "state" },
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
      console.log(restaurants);

      setRestaurants(restaurants);
    });
  }, []);


  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            {
              headings.map((heading) => {
                return <td key={heading.dataProperty}>{heading.label}</td>
              })
            }
          </tr>
        </thead>

        <tbody>
        { 
          restaurants?.map((restaurant) => {
            return (
              <tr key={restaurant.id}>
                {
                  headings.map((heading) => {
                    return <td key={heading.dataProperty}>{ restaurant[heading.dataProperty] }</td>
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

// {id: "f223fdd0-4adc-423e-9747-980a66c256ca", name: "Old Hickory Steakhouse", address1: "201 Waterfront St", city: "Oxon Hill", state: "MD", …}
