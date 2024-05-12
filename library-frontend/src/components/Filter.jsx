/* eslint-disable react/prop-types */
export default function Filter({ setFilter, currentUser, genreList, filter }) {
  const handleFilter = (value) => {
    if (value.startsWith("recommended-")) {
      const actualGenre = value.split("recommended-")[1];
      setFilter(actualGenre);
    } else {
      setFilter(value);
    }
  };
  return (
    <div className="filter">
      <label htmlFor="genre">Filter by genre</label>
      <select
        name="genre"
        id="genre"
        value={filter}
        onChange={(e) => handleFilter(e.target.value)}
      >
        <option value="" disabled>
          Select Filter
        </option>
        <option value="all"> All</option>
        {currentUser && (
          <option value={`recommended-${currentUser.favoriteGenre}`}>
            Recommended
          </option>
        )}
        {genreList.map((g) => (
          <option key={g} value={g}>
            {g}
          </option>
        ))}
      </select>
    </div>
  );
}
