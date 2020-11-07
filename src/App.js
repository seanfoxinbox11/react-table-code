import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';


function App() {

  const headings = [
    { label: "ID", dataProperty: "id" },
    { label: "Name", dataProperty: "name" },
    { label: "Address", dataProperty: "address1" },
    { label: "City", dataProperty: "city" },
    { label: "State", dataProperty: "state" },
  ];

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
        <tr>
          {
            headings.map((heading) => {
              return <td key={heading.id}>{heading.label}</td>
            })
          }
        </tr>
      </table>
    </div>
  );
}
export default App;