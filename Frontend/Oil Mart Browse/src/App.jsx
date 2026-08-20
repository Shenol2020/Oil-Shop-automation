import ProductGrid from "./Components/ProductGrid.jsx";

function App() {
  const items = [
    "Engine Oil",
    "Brake Fluid",
    "Coolant",
    "Transmission Fluid",
    "Power Steering Fluid",
  ];

  const types = [
    "Synthetic Oil",
    "Conventional Oil",
    "High-Mileage Oil",
    "Diesel Engine Oil",
    "Racing Oil",
  ];

  const prices = [
    "$30 - $50",
    "$10 - $20",
    "$15 - $25",
    "$25 - $40",
    "$50 - $100",
  ];

  const handleSelectItem = (item) => {
    console.log("Selected item:", item);
  };
  
  return (
    <div>
      <ProductGrid />
    </div>
  );
}

export default App;
