import ProductGrid from "./Components/ProductGrid.jsx";
import Navbar from "./Components/Nav_bar.jsx";
import Sidebar from "./Components/Sidebar.jsx";

function App() {
  const handleSelectItem = (item) => {
    console.log("Selected item:", item);
  };
  
  return (
    <div>
      <Navbar />
      <Sidebar />
      <ProductGrid />
    </div>
  );
}

export default App;
