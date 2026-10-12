import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createSlug } from '../utils/CreateSlug.jsx';

function ProductDetails() {
  // Extract the pID from the URL
  const { pID } = useParams(); 
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        // Send the slug to the Spring Boot backend
        const response = await fetch(`http://localhost:8081/api/products/${pID}`);
        
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

  if (loading) return <div className="container mt-5 text-center">Loading...</div>;
  if (!product) return <div className="container mt-5 text-center">Product not found.</div>;

  return (
    <div className="container mt-5">
       {/* Render your product details layout here */}
       <h2>{product.name}</h2>
       <h3 className="text-primary mb-4">Rs. {product.price}</h3>
       {/* ... */}
    </div>
  );
}

export default ProductDetails;