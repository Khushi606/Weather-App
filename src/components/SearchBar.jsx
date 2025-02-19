import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons"; // Import the search icon

function SearchBar({ onSearch }) {
  const [city, setCity] = useState("");

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(city);
    setCity("");
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Enter City Name"
        value={city}
        onChange={handleInputChange}
      />
      <button onClick={handleSearchClick}>
        <FontAwesomeIcon icon={faSearch} style={{ fontSize: "18px" }} />
      </button>
    </div>
  );
}

export default SearchBar;
