import Item from './item';

export default function ItemList({ items, loading }) {
  return (
    <div>
      {loading ? (
        <p>Loading ingredients...</p>
      ) : (
        (Array.isArray(items) ? items : []).map((item) => (
          <Item key={item.id} item={item} />
        ))
      )}
    </div>
  );
}
