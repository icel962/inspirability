"use client";

import { useEffect, useState } from "react";
import FilterBar from "./shared/FilterBar";
import CardGrid from "./shared/CardGrid";
import "../styles/school.css";

const SportSection = () => {
  const [sports, setSports] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    budget: 900,
    distance: 35,
    review: "any",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const cardsPerPage = 8;

  useEffect(() => {
    fetch("http://localhost:5000/api/sports")
      .then((res) => res.json())
      .then((data) => {
        setSports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const normalizeType = (value) => {
    const type = (value || "").toLowerCase();
    if (type.includes("academy")) return "academy";
    if (type.includes("gym") || type.includes("fitness")) return "fitness";
    if (type.includes("club")) return "club";
    return "other";
  };

  const toNumber = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const data = sports.map((sport) => ({
    id: `sport-${sport.sport_center_id}`,
    name: sport.sport_center_name || "",
    type: normalizeType(sport.sport_center_type),
    typeLabel: sport.sport_center_type || "N/A",
    price:
      toNumber(sport.session_price_max) ??
      toNumber(sport.session_price_min) ??
      toNumber(sport.price) ??
      0,
    distance:
      toNumber(sport.distance_km) ??
      toNumber(sport.distance) ??
      toNumber(sport.location_distance) ??
      0,
    rating:
      toNumber(sport.rating) ??
      toNumber(sport.review) ??
      toNumber(sport.average_rating) ??
      5,
    location: sport.location || "N/A",
    phone: sport.phone_number || "N/A",
    appointmentHref: `/appointment?type=sport&id=${sport.sport_center_id}&name=${encodeURIComponent(sport.sport_center_name || "")}`,
  }));

  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchLower) ||
      item.typeLabel.toLowerCase().includes(searchLower) ||
      item.phone.toLowerCase().includes(searchLower) ||
      item.location.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;
    if (filters.type !== "all" && item.type !== filters.type) return false;
    if (item.price > filters.budget) return false;
    if (item.distance > filters.distance) return false;
    if (filters.review !== "any" && item.rating < Number(filters.review)) return false;
    return true;
  });

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredData.length / cardsPerPage);

  return (
    <div className="sport-section">
      <section className="page-header">
        <div className="page-header-content">
          <h1>Sports Profiles</h1>
          <p>
            Browse inclusive sports clubs and academies tailored for different needs and skill levels.
          </p>
        </div>
      </section>

      <FilterBar
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        filters={filters}
        setFilters={(next) => {
          setFilters(next);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search sport center..."
      />

      {loading ? (
        <p>Loading sport centers...</p>
      ) : (
        <>
          <CardGrid data={currentCards} emptyText="No sport centers found." />

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SportSection;
