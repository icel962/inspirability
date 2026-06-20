import ProfileCard from "./ProfileCard";

const CardGrid = ({ data, emptyText }) => {
  return (
    <div className="grid-container">
      {data.length > 0 ? (
        data.map((item) => <ProfileCard key={item.id} item={item} />)
      ) : (
        <p>{emptyText}</p>
      )}
    </div>
  );
};

export default CardGrid;
