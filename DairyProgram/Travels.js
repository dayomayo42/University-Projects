// client/src/Travels.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Travels() {
  const [travels, setTravels] = useState([]);

  useEffect(() => {
    const fetchTravels = async () => {
      const response = await axios.get('http://localhost:5000/travels');
      setTravels(response.data);
    };
    
    fetchTravels();
  }, []);

  return (
    <div>
      {travels.map(travel => (
        <div key={travel._id}>
          <h2>{travel.location}</h2>
          <img src={travel.image} alt={travel.location} />
          <p>Cost: {travel.cost}</p>
          <p>Cultural Sites: {travel.culturalSites.join(', ')}</p>
          <p>Places to Visit: {travel.placesToVisit.join(', ')}</p>
          <p>Convenience Rating: {travel.convenienceRating}</p>
          <p>Coordinates: ({travel.coordinates.latitude}, {travel.coordinates.longitude})</p>
          <p>Posted by: {travel.userId.username}</p>
        </div>
      ))}
    </div>
  );
}

const mongoose = require('mongoose');

const TravelSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: { type: String, required: true },
    image: { type: String, required: true },
    cost: { type: Number, required: true },
    culturalSites: { type: [String], required: false },
    placesToVisit: { type: [String], required: false },
    convenienceRating: { type: Number, required: false },
    coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
});

const Travel = mongoose.model('Travel', TravelSchema);
module.exports = Travel;

export default Travels;