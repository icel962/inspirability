"use client";

import { useEffect, useMemo, useState } from "react";
import FilterBar from "./shared/FilterBar";
import CardGrid from "./shared/CardGrid";
import {
  buildProviderAppointmentHref,
  buildProviderDetailsHref,
  resolveProviderImage,
} from "../utils/providerPresentation";
import {
  buildSearchText,
  createServicesList,
  getAgeGroups,
  getDiagnoses,
  getDynamicOptions,
  getMaxValue,
  getSchoolTypeLabel,
  parsePriceRange,
  roundBudget,
} from "../utils/providerFilters";
import "../styles/school.css";

const INITIAL_FILTERS = {
  type: "all",
  budget: 10000,
  distance: 35,
  review: "any",
  ageGroup: "all",
  diagnosis: "all",
};

const SchoolSection = () => {
  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
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

  const toNumber = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const RATING_POOL = [3.5, 4.0, 4.0, 4.5, 4.5, 5.0];
  const PRICE_POOL  = [3000, 5000, 8000, 10000, 12000, 15000, 20000, 25000, 30000, 40000];

  const data = useMemo(() => {
    // Deduplicate by school_id before mapping — guards against the old backend
    // media-JOIN bug that returned one row per media file for the same school.
    const seen = new Set();
    const unique = schools.filter((s) => {
      if (seen.has(s.school_id)) return false;
      seen.add(s.school_id);
      return true;
    });

    return unique.map((school, index) => {
        const scid = Number(school.school_id) || 0;
        const typeLabel = getSchoolTypeLabel(school);
        const parsedAgeGroups = getAgeGroups(
          school.educational_level,
          school.class_capacity,
          school.admission_details
        );
        const ageGroups = parsedAgeGroups.length > 0 ? parsedAgeGroups : ["7–12"];
        const diagnoses = getDiagnoses(
          school.special_type,
          school.history_info,
          school.admission_details
        );
        const services = createServicesList(
          school.special_type,
          school.curriculum_type,
          school.admission_details,
          school.history_info
        );

        const rawDist   = toNumber(school.distance_km) ?? toNumber(school.distance);
        const rawRating = toNumber(school.rating) ?? toNumber(school.review) ?? toNumber(school.average_rating);
        const rawFees   = parsePriceRange(school.annual_fees) ?? parsePriceRange(school.registration_fees) ?? toNumber(school.price);

        return {
          id: `school-${school.school_id}`,
          providerId: school.school_id,
          providerType: "school",
          name: school.school_name || "",
          type: typeLabel,
          typeLabel,
          price: Math.min(
            (rawFees !== null && rawFees > 0)
              ? Math.round(rawFees / 1000) * 1000
              : PRICE_POOL[scid % PRICE_POOL.length],
            50000
          ),
          distance: Math.min(
            (rawDist !== null && rawDist > 0) ? rawDist : ((scid % 30) + 5),
            50
          ),
          rating: (rawRating !== null && rawRating > 0) ? rawRating : RATING_POOL[scid % 6],
          ageGroups,
          diagnoses,
          services,
          searchText: buildSearchText([
            school.school_name,
            typeLabel,
            school.special_type,
            school.city,
            school.curriculum_type,
            school.history_info,
            diagnoses,
            services,
          ]),
          image: resolveProviderImage(school, "school", index),
          location: school.city || "N/A",
          email: school.email || "N/A",
          phone: school.phone_number || school.tel_no || "N/A",
          detailsHref: buildProviderDetailsHref("school", school.school_id),
          appointmentHref: buildProviderAppointmentHref("school", school.school_id, school.school_name || ""),
        };
      });
  }, [schools]);

  const budgetMax = useMemo(() => roundBudget(getMaxValue(data, "price", 10000, 50000)), [data]);
  const distanceMax = useMemo(() => getMaxValue(data, "distance", 35, 50), [data]);
  const typeOptions = useMemo(() => getDynamicOptions(data, "type"), [data]);
  const ageOptions = useMemo(() => getDynamicOptions(data, "ageGroups"), [data]);
  const diagnosisOptions = useMemo(() => getDynamicOptions(data, "diagnoses"), [data]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      budget:
        prev.budget === INITIAL_FILTERS.budget || prev.budget > budgetMax
          ? budgetMax
          : prev.budget,
      distance:
        prev.distance === INITIAL_FILTERS.distance || prev.distance > distanceMax
          ? distanceMax
          : prev.distance,
    }));
  }, [budgetMax, distanceMax]);

  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    const matchesSearch = item.searchText.includes(searchLower);

    if (!matchesSearch) return false;
    if (filters.type !== "all" && item.type !== filters.type) return false;
    if (item.price > filters.budget) return false;
    if (item.distance > filters.distance) return false;
    if (filters.review !== "any" && item.rating < Number(filters.review)) return false;
    if (filters.ageGroup !== "all" && !item.ageGroups.includes(filters.ageGroup)) return false;
    if (filters.diagnosis !== "all" && !item.diagnoses.includes(filters.diagnosis)) return false;
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
        typeOptions={typeOptions}
        ageOptions={ageOptions}
        diagnosisOptions={diagnosisOptions}
        budgetMax={budgetMax}
        distanceMax={distanceMax}
      />

      {loading ? (
        <p>Loading schools...</p>
      ) : (
        <>
          <CardGrid data={currentCards} emptyText="No matching services found." />

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
