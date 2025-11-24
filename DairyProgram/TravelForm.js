// client/src/TravelForm.js
import React, { useState } from 'react';
import axios from 'axios';

function TravelForm() {
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [cost, setCost] = useState('');
  const [culturalSites, setCulturalSites] = useState('');
  const [placesToVisit, setPlacesToVisit] = useState('');
  const [convenienceRating, setConvenienceRating] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:5000/travels', {
      location,
      image,
      cost,
      culturalSites: culturalSites.split(','),
      placesToVisit: placesToVisit.split(','),
      convenienceRating,
      coordinates: { latitude, longitude },
      headers: { Authorization: Bearer ${token} }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
      <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />
      <input value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Cost" />
      <input value={culturalSites} onChange={(e) => setCulturalSites(e.target.value)} placeholder="Cultural Sites (comma separated)" />
      <input value={placesToVisit} onChange={(e) => setPlacesToVisit(e.target.value)} placeholder="Places to Visit (comma separated)" />
      <input value={convenienceRating} onChange={(e) => setConvenienceRating(e.target.value)} placeholder="Convenience Rating" />
      <input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude" />
      <input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude" />
      <button type="submit">Add Travel</button>
    </form>
  );
}

export default TravelForm;
