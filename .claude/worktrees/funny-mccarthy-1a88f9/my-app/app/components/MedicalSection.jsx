"use client";

import { useEffect, useState } from "react";
import FilterBar from "./shared/FilterBar";
import CardGrid from "./shared/CardGrid";
import "../styles/school.css";

const MedicalSection = () => {
  const [clinics, setClinics] = useState([]);
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
    fetch("http://localhost:5000/api/medical")
      .then((res) => res.json())
      .then((data) => {
        setClinics(data);
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
    if (type.includes("clinic") || type.includes("hospital") || type.includes("medical")) {
      return "club";
    }
    return "other";
  };

  const toNumber = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const data = clinics.map((clinic) => ({
    id: `medical-${clinic.clinic_id}`,
    name: clinic.clinic_name || "",
    type: normalizeType(clinic.clinic_type),
    typeLabel: clinic.clinic_type || "N/A",
    price:
      toNumber(clinic.session_price_max) ??
      toNumber(clinic.session_price_min) ??
      toNumber(clinic.price) ??
      0,
    distance:
      toNumber(clinic.distance_km) ??
      toNumber(clinic.distance) ??
      0,
    rating:
      toNumber(clinic.rating) ??
      toNumber(clinic.review) ??
      toNumber(clinic.average_rating) ??
      5,
    location: clinic.location || "N/A",
    phone: clinic.phone_number || "N/A",
    appointmentHref: `/appointment?type=clinic&id=${clinic.clinic_id}&name=${encodeURIComponent(clinic.clinic_name || "")}`,
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
          <h1>Medical Profiles</h1>
          <p>
            Browse inclusive medical clinics and specialists tailored for different needs and care levels.
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
        searchPlaceholder="Search medical clinic..."
      />

      {loading ? (
        <p>Loading medical clinics...</p>
      ) : (
        <>
          <CardGrid data={currentCards} emptyText="No medical clinics found." />

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

export default MedicalSection;
