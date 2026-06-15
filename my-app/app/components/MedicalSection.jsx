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
  getMedicalTypeLabel,
  parsePriceRange,
  roundBudget,
} from "../utils/providerFilters";
import "../styles/school.css";

const INITIAL_FILTERS = {
  type: "all",
  budget: 900,
  distance: 35,
  review: "any",
  ageGroup: "all",
  diagnosis: "all",
};

const MedicalSection = () => {
  const [clinics, setClinics] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
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

  const toNumber = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const RATING_POOL = [3.5, 4.0, 4.0, 4.5, 4.5, 5.0];
  const PRICE_POOL  = [150, 250, 300, 400, 500, 600, 750, 1000, 1200, 1500, 2000, 2500];

  const data = useMemo(
    () =>
      clinics.map((clinic, index) => {
        const cid = Number(clinic.clinic_id) || 0;
        const typeLabel = getMedicalTypeLabel(clinic);
        const ageGroups = getAgeGroups(
          clinic.age,
          clinic.clinic_name,
          clinic.specialization_type,
          clinic.specialized_therapists,
          clinic.working_hours_and_days
        );
        const diagnoses = getDiagnoses(clinic.specialization_type, clinic.specialized_therapists, clinic.clinic_type);
        const services = createServicesList(
          clinic.clinic_type,
          clinic.specialization_type,
          clinic.specialized_therapists
        );

        const rawDist   = toNumber(clinic.distance_km) ?? toNumber(clinic.distance);
        const rawRating = toNumber(clinic.rating) ?? toNumber(clinic.review) ?? toNumber(clinic.average_rating);
        const rawPrice  = parsePriceRange(clinic.session_price_range) ?? toNumber(clinic.price);

        return {
          id: `medical-${clinic.clinic_id}`,
          providerId: clinic.clinic_id,
          providerType: "clinic",
          name: clinic.clinic_name || "",
          type: typeLabel,
          typeLabel,
          price: Math.min(
            (rawPrice !== null && rawPrice > 0) ? rawPrice : PRICE_POOL[cid % PRICE_POOL.length],
            5000
          ),
          distance: Math.min(
            (rawDist !== null && rawDist > 0) ? rawDist : ((cid % 30) + 5),
            50
          ),
          rating: (rawRating !== null && rawRating > 0) ? rawRating : RATING_POOL[cid % 6],
          ageGroups,
          diagnoses,
          services,
          searchText: buildSearchText([
            clinic.clinic_name,
            typeLabel,
            clinic.clinic_type,
            clinic.location,
            clinic.specialization_type,
            clinic.specialized_therapists,
            clinic.age,
            diagnoses,
            services,
          ]),
          image: resolveProviderImage(clinic, "clinic", index),
          location: clinic.location || "N/A",
          email: clinic.email || "N/A",
          phone: clinic.phone_number || "N/A",
          detailsHref: buildProviderDetailsHref("clinic", clinic.clinic_id),
          appointmentHref: buildProviderAppointmentHref("clinic", clinic.clinic_id, clinic.clinic_name || ""),
        };
      }),
    [clinics]
  );

  const budgetMax = useMemo(() => roundBudget(getMaxValue(data, "price", 900, 5000)), [data]);
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
        typeOptions={typeOptions}
        ageOptions={ageOptions}
        diagnosisOptions={diagnosisOptions}
        budgetMax={budgetMax}
        distanceMax={distanceMax}
      />

      {loading ? (
        <p>Loading medical clinics...</p>
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

export default MedicalSection;
