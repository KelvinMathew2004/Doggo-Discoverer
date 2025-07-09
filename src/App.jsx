import { useState } from 'react'
import './App.css'

const API_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [currentDog, setCurrentDog] = useState(null);
  const [prevDogs, setPrevDogs] = useState([]);
  const [banList, setBanList] = useState([]);

  const handleAddToBanList = (attribute) => {
    if (!banList.includes(attribute)) {
      setBanList(prevList => [...prevList, attribute]);
    }
  };

  const handleRemoveFromBanList = (attributeToRemove) => {
    setBanList(prevList => prevList.filter(item => item !== attributeToRemove));
  };

  const isDogBanned = (dog) => {
    const dogAttributes = [dog.name, dog.origin, dog.weight, dog.life_span];
    return banList.some(bannedItem => dogAttributes.includes(bannedItem));
  };

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

        if (!breedInfo.origin) {
          console.warn("Fetched a dog with an unknown origin. Refetching...");
          fetchRandomDog();
          return;
        }

        const newDog = {
          id: dogData.id,
          url: dogData.url,
          name: breedInfo.name,
          weight: `${breedInfo.weight.imperial} lbs`,
          origin: breedInfo.origin,
          life_span: breedInfo.life_span,
          temperament: breedInfo.temperament
        };

        if (isDogBanned(newDog)) {
          console.warn(`Banned dog fetched: ${newDog.name}. Refetching...`);
          fetchRandomDog();
          return;
        }

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

  const getArticle = (word) => {
    if (!word) return 'a';
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const firstLetter = word[0].toLowerCase();
    return vowels.includes(firstLetter) ? 'An' : 'A';
  };

  return (
    <div className="whole-page">
      {prevDogs.length > 0 && (
        <div className="history">
          <h3 style={{ fontWeight: "bolder"}}>Who have we seen so far?</h3>
          {prevDogs.map((dog) => (
            <div key={dog.id}> 
              <img 
                src={dog.url}
                alt={`A ${dog.name} from a previous search`} 
                style={{ width: '100px', height: '100px', margin: '5px', objectFit: 'cover', borderRadius: '8px'}} 
              />
              <h4>{getArticle(dog.name)} {dog.name} dog from {dog.origin}</h4>
            </div>
          ))}
        </div>
      )}
      <div className="main-card">
        <h1 className='heading'>Veni Vici!</h1>
        <p>Discover dogs from your wildest dreams!</p>
        <a className="emojis">🐶 🐕 🐩 🦮 🦴</a>
        {currentDog && (
          <div className="dog-card">
            <div className="attributes">
              <button onClick={() => handleAddToBanList(currentDog.name)} className="attribute">{currentDog.name}</button>
              <button onClick={() => handleAddToBanList(currentDog.origin)} className="attribute">{currentDog.origin}</button>
              <button onClick={() => handleAddToBanList(currentDog.weight)} className="attribute">{currentDog.weight}</button>
              <button onClick={() => handleAddToBanList(currentDog.life_span)} className="attribute">{currentDog.life_span}</button>
            </div>
            <img src={currentDog.url} alt={currentDog.name} className="dog-image" />
          </div>
        )}
        <button onClick={fetchRandomDog} className="discover">🔀 Discover!</button>
      </div>
      <div className="ban-list">
        <h2 style={{ fontWeight: "bolder", margin: "0rem 0rem 1rem 0rem"}}>Ban List</h2>
        <h4 style={{ margin: 0}}>Select an attribute in your listing to ban it</h4>
        <div className="ban-list-items">
          {banList.map((item) => (
            <button key={item} onClick={() => handleRemoveFromBanList(item)} className="ban-item">
              {item} <span>&times;</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
