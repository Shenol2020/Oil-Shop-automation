import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import {CartContext} from "../Context/CartContext.jsx";

function ProductDetails() {
  // Extract the pID from the URL
  const { pID } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/products/${pID}`,
        );

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [pID]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    console.log(`Added ${quantity} of ${product.p_name} to cart`);
    alert(`Successfully added ${quantity} item(s) to your cart!`);
  };

  if (loading)
    return <div className="container mt-5 text-center">Loading...</div>;
  if (!product)
    return <div className="container mt-5 text-center">Product not found.</div>;

  return (
    <>
      <div className="container mt-5">
        <div className="row align-items-center gx-5">
          {/* Left Column: Image and Description */}
          <div className="col-md-6 text-center">
            <h2 className="mb-3">{product.p_name}</h2>
            <img
              src={product.pic}
              alt={product.p_name}
              className="img-fluid mb-3 rounded shadow-sm"
              style={{ maxHeight: "350px", objectFit: "contain" }}
            />
            <h3 className="text-primary mb-3">Rs. {product.price}</h3>
            <p className="text-muted text-start">{product.p_description}</p>
          </div>

          {/* Right Column: Pricing, Quantity, and Action Buttons Card */}
          <div className="col-md-6">
            <div className="card p-4 shadow-sm border-0 bg-light">
              <h4 className="mb-3">Order Options</h4>

              <div className="mb-3">
                <label htmlFor="quantity" className="form-label fw-bold">
                  Quantity:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  className="btn btn-outline-primary btn-lg"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button className="btn btn-primary btn-lg">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
