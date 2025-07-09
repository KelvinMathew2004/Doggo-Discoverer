import { useState } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [currentDog, setCurrentDog] = useState(null);
  const [prevDogs, setPrevDogs] = useState([]);

  const fetchRandomDog = () => {
    const query = `https://api.thedogapi.com/v1/images/search?has_breeds=1&api_key=${API_KEY}`;
    callAPI(query).catch(console.error);
  };

  const callAPI = async (query) => {
    try {
      const response = await fetch(query);
      const jsonData = await response.json();

      if (jsonData && jsonData.length > 0 && jsonData[0].breeds && jsonData[0].breeds.length > 0) {
        const dogData = jsonData[0];
        const breedInfo = dogData.breeds[0];

        const newDog = {
          id: dogData.id,
          url: dogData.url,
          name: breedInfo.name,
          weight: `${breedInfo.weight.imperial} lbs`,
          origin: breedInfo.origin || "Unknown",
          life_span: breedInfo.life_span,
          temperament: breedInfo.temperament
        };

        if (currentDog) {
          setPrevDogs(dogs => [currentDog, ...dogs]);
        }

        setCurrentDog(newDog);
      } else {
        console.warn("API returned a dog without breed info, fetching another...");
        fetchRandomDog();
      }
    } catch (error) {
      console.error("Failed to call The Dog API:", error);
      alert("An error occurred while trying to fetch a dog. Please check the console.");
    }
  };

  return (
    <div className="whole-page">
      <div className="history">
        {prevDogs.length > 1 && (
        <div>
          <h3 style={{ fontWeight: "bolder"}}>Who have we seen so far?</h3>
          {prevDogs.map((dog) => (
            <div key={dog.id}> 
              <img 
                src={dog.url}
                alt={`A ${dog.name} from a previous search`} 
                style={{ width: '100px', height: '100px', margin: '5px', objectFit: 'cover', borderRadius: '8px'}} 
              />
              <h4>A {dog.name} dog from {dog.origin}</h4>
            </div>
          ))}
        </div>
      )}
      </div>
      <div className="main-card">
        <h1 className='heading'>Veni Vici!</h1>
        <h4>Discover dogs from your wildest dreams!</h4>
        <p>🐶🐕🦮🐩🦴</p>
        {currentDog && (
          <div className="dog-card">
            <div className="attributes">
              <button className="attribute">{currentDog.name}</button>
              <button className="attribute">{currentDog.origin}</button>
              <button className="attribute">{currentDog.weight}</button>
              <button className="attribute">{currentDog.life_span}</button>
            </div>
            <img src={currentDog.url} alt={currentDog.name} className="dog-image" />
          </div>
        )}
        <button onClick={fetchRandomDog} className="discover">🔀 Discover!</button>
      </div>
      <div className="ban-list">
        <h2 style={{ fontWeight: "bolder"}}>Ban List</h2>
        <h4>Select an attribute in your listing to ban it</h4>

      </div>
    </div>
  )
}

export default App
