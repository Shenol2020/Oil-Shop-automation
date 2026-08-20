import { useState } from "react";
import { useEffect } from "react";
import ProductCard from "./ProductCard";

function ProductGrid() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:8081/api/products')
      .then(response => response.json())
      .then(data => {
        setProducts(data); // Save the database rows into React state
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleSelectProduct = (productName) => {
    console.log(`Selected product: ${productName}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Product Catalog</h2>

      {/* Bootstrap grid: 1 column on mobile, 2 on tablets, 5 on desktops */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-4">
        {products.map((product) => (
          <div className="col" key={product.pID}>
            <ProductCard
              name={product.p_name}
              type={product.category}
              price={product.price} 
              img={product.pic}             
              onSelect={handleSelectProduct}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductGrid;
