const defaultTypeOptions = [
  { value: "club", label: "Private Sports Club" },
  { value: "academy", label: "Sports Academy" },
  { value: "fitness", label: "Gym & Fitness" },
];

const FilterBar = ({
  search,
  setSearch,
  filters,
  setFilters,
  searchPlaceholder,
  typeOptions = defaultTypeOptions,
  budgetMax = 900,
  distanceMax = 35,
}) => {
  return (
    <section className="search-section">
      <div className="search-container">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="filters-row">
        <div className="filter-box">
          <label className="filter-label" htmlFor="profile-filter-type">
            Type / Specialty
          </label>
          <select
            id="profile-filter-type"
            value={filters.type}
            onChange={(event) => setFilters({ ...filters, type: event.target.value })}
          >
            <option value="all">All types</option>
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-box">
          <div className="filter-top">
            <span className="filter-title">Budget</span>
            <strong>Up to EGP {filters.budget}</strong>
          </div>
          <input
            type="range"
            min="0"
            max={budgetMax}
            value={filters.budget}
            onChange={(event) => setFilters({ ...filters, budget: Number(event.target.value) })}
          />
        </div>

        <div className="filter-box">
          <div className="filter-top">
            <span className="filter-title">Distance</span>
            <strong>Up to {filters.distance} km</strong>
          </div>
          <input
            type="range"
            min="0"
            max={distanceMax}
            value={filters.distance}
            onChange={(event) => setFilters({ ...filters, distance: Number(event.target.value) })}
          />
        </div>

        <div className="filter-box">
          <label className="filter-label" htmlFor="profile-filter-review">
            Review
          </label>
          <select
            id="profile-filter-review"
            value={filters.review}
            onChange={(event) => setFilters({ ...filters, review: event.target.value })}
          >
            <option value="any">Any rating</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars & up</option>
            <option value="3">3 stars & up</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default FilterBar;
