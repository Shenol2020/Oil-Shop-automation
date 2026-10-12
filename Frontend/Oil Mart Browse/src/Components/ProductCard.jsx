import {Link} from "react-router-dom";
import { createSlug } from '../utils/CreateSlug.jsx';

function ProductCard({ pID,name, type, price, volume, onSelect, img }) {
  // Generate the slugified URL
  const productUrl = `/product/${pID}/${createSlug(name)}/${volume}/`;

  return (
    <div className="card h-100 shadow-sm border-0">
      {img && <img src={img} className="card-img-top" alt={name} />}
      {/*<div className="bg-light text-center py-5 mb-2">
        <span className="text-muted">Image Placeholder</span>
      </div>*/}
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1">{name}</h5>
        <p className="card-text text-muted small mb-3">{type}</p>
        <h6 className="mb-3">{price}</h6>
        
        {/* Pushes the button to the bottom so all cards are equal height */}
        <div className="mt-auto">
          <Link
            className="btn btn-primary w-100"
            onClick={() => onSelect(name)} to={productUrl}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;