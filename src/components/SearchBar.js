import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ searchText }) => {
    const [results, setResults] = useState([]);

    const search = async () => {
        const response = await axios.get(`http://localhost:5000/api/search?q=${searchText}`);
        setResults(response.data);
    };

    return (
        <div className="p-4 bg-white rounded-xl shadow mt-4">
            <h2 className="text-xl mb-2 font-semibold">🔎 Search Interface</h2>
            <button onClick={search} className="px-4 py-2 bg-green-500 text-white rounded">Search</button>
            <ul className="mt-4">
                {results.map((r, i) => (
                    <li key={i} className="p-2 border-b">{r.title || JSON.stringify(r)}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchBar;
