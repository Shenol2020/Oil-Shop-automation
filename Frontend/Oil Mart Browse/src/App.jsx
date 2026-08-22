import ProductGrid from "./Components/ProductGrid.jsx";
import Navbar from "./Components/navbar.jsx";

function App() {
  const handleSelectItem = (item) => {
    console.log("Selected item:", item);
  };
  
  return (
    <div>
      <Navbar />
      <ProductGrid />
    </div>
  );
}

export default App;
