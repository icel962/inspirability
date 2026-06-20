"use client";

import { useEffect, useState } from "react";
import FilterBar from "./shared/FilterBar";
import CardGrid from "./shared/CardGrid";
import "../styles/school.css";

const SchoolSection = () => {
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    budget: 900,
    distance: 35,
    review: "any",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/schools")
      .then((res) => res.json())
      .then((data) => {
        setSchools(data);
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

  const data = schools.map((school) => ({
    id: `school-${school.school_id}`,
    name: school.school_name || "",
    type: normalizeType(school.special_type),
    typeLabel: school.special_type || "N/A",
    price:
      toNumber(school.annual_fees) ??
      toNumber(school.price) ??
      0,
    distance:
      toNumber(school.distance_km) ??
      toNumber(school.distance) ??
      0,
    rating:
      toNumber(school.rating) ??
      toNumber(school.review) ??
      toNumber(school.average_rating) ??
      5,
    location: school.city || "N/A",
    phone: school.phone_number || "N/A",
    appointmentHref: `/appointment?type=school&id=${school.school_id}&name=${encodeURIComponent(school.school_name || "")}`,
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

  const cardsPerPage = 8;
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredData.length / cardsPerPage);

  return (
    <div className="sport-section">
      <section className="page-header">
        <div className="page-header-content">
          <h1>School Profiles</h1>
          <p>
            Browse inclusive schools and learning centers tailored for different needs and goals.
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
        searchPlaceholder="Search school..."
      />

      {loading ? (
        <p>Loading schools...</p>
      ) : (
        <>
          <CardGrid data={currentCards} emptyText="No schools found." />

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

export default SchoolSection;
