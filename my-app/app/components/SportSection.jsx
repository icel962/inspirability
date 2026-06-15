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
  getSportTypeLabel,
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

const SportSection = () => {
  const [sports, setSports] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
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

  const toNumber = (value) => {
    const parsed = Number.parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const RATING_POOL = [3.5, 4.0, 4.0, 4.5, 4.5, 5.0];
  const PRICE_POOL  = [100, 150, 200, 250, 300, 400, 500, 600, 750, 1000, 1200, 1500];

  const data = useMemo(
    () =>
      sports.map((sport, index) => {
        const sid = Number(sport.sport_center_id) || 0;
        const typeLabel = getSportTypeLabel(sport);
        const parsedAgeGroups = getAgeGroups(sport.age, sport.working_days_and_hours, sport.details);
        const ageGroups = parsedAgeGroups.length > 0 ? parsedAgeGroups : ["7–12", "Teens"];
        const diagnoses = getDiagnoses(sport.supported_conditions, sport.details, sport.more_info);
        const services = createServicesList(
          sport.sports_type_offered,
          sport.supported_conditions,
          sport.details,
          sport.more_info
        );

        const rawDist   = toNumber(sport.distance_km) ?? toNumber(sport.distance) ?? toNumber(sport.location_distance);
        const rawRating = toNumber(sport.rating) ?? toNumber(sport.review) ?? toNumber(sport.average_rating);
        const rawPrice  = parsePriceRange(sport.session_price_max) ?? parsePriceRange(sport.session_price_min) ?? toNumber(sport.price);

        return {
          id: `sport-${sport.sport_center_id}`,
          providerId: sport.sport_center_id,
          providerType: "sport",
          name: sport.sport_center_name || "",
          type: typeLabel,
          typeLabel,
          price: Math.min(
            (rawPrice !== null && rawPrice > 0) ? rawPrice : PRICE_POOL[sid % PRICE_POOL.length],
            3000
          ),
          distance: Math.min(
            (rawDist !== null && rawDist > 0) ? rawDist : ((sid % 30) + 5),
            50
          ),
          rating: (rawRating !== null && rawRating > 0) ? rawRating : RATING_POOL[sid % 6],
          ageGroups,
          diagnoses,
          services,
          searchText: buildSearchText([
            sport.sport_center_name,
            typeLabel,
            sport.sport_center_type,
            sport.location,
            sport.supported_conditions,
            services,
            diagnoses,
          ]),
          image: resolveProviderImage(sport, "sport", index),
          location: sport.location || "N/A",
          email: sport.email_address || "N/A",
          phone: sport.phone_number || "N/A",
          detailsHref: buildProviderDetailsHref("sport", sport.sport_center_id),
          appointmentHref: buildProviderAppointmentHref("sport", sport.sport_center_id, sport.sport_center_name || ""),
        };
      }),
    [sports]
  );

  const budgetMax = useMemo(() => roundBudget(getMaxValue(data, "price", 900, 3000)), [data]);
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
        typeOptions={typeOptions}
        ageOptions={ageOptions}
        diagnosisOptions={diagnosisOptions}
        budgetMax={budgetMax}
        distanceMax={distanceMax}
      />

      {loading ? (
        <p>Loading sport centers...</p>
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

export default SportSection;
