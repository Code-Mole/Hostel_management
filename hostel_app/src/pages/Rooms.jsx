import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { rooms as allRooms } from "../data/rooms";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaStar,
} from "react-icons/fa";
import "./Rooms.css";

function Rooms() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all"); // all | room | house
  const [sort, setSort] = useState("relevance"); // relevance | price-asc | price-desc | rating

  const filtered = useMemo(() => {
    let list = allRooms.filter((r) =>
      r.title.toLowerCase().includes(query.toLowerCase())
    );
    if (type !== "all") list = list.filter((r) => r.type === type);

    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.pricePerMonth - b.pricePerMonth);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.pricePerMonth - a.pricePerMonth);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [query, type, sort]);

  return (
    <div className="rooms-page">
      <header className="rooms-header">
        <h1>Available Rooms & Houses</h1>
        <p>
          Browse all available units for booking. Click any card to see details.
        </p>
      </header>

      <div className="rooms-filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="Room">Rooms</option>
          <option value="House">Houses</option>
          <option value="Hostel">Hostel</option>
          <option value="Hotel">Hotel</option>
          <option value="Estate">Estate</option>
          <option value="Appartment">Appartment</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="relevance">Sort: Relevance</option>
          <option value="price-asc">Sort: Price (Low to High)</option>
          <option value="price-desc">Sort: Price (High to Low)</option>
          <option value="rating">Sort: Rating</option>
        </select>
      </div>

      <section className="rooms-grid">
        {filtered.map((room) => (
          <Link key={room.id} to={`/rooms/${room.id}`} className="room-card">
            <div className="room-thumb">
              <img src={room.images?.[0]} alt={room.title} />
              <span className={`badge ${room.type}`}>{room.type}</span>
            </div>
            <div className="room-body">
              <h3>{room.title}</h3>
              <div className="meta">
                <span>
                  <FaMapMarkerAlt /> {room.location}
                </span>
                <span>
                  <FaStar /> {room.rating}
                </span>
              </div>
              <div className="specs">
                <span>
                  <FaBed /> {room.bedrooms} bd
                </span>
                <span>
                  <FaBath /> {room.bathrooms} ba
                </span>
                <span>
                  <FaRulerCombined /> {room.sizeSqft} sqft
                </span>
              </div>
            </div>
            <div className="room-footer">
              <p>
                Price : <strong>${room.pricePerMonth}/month</strong>
              </p>
            </div>
            <button className="view-btn">View details</button>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default Rooms;
