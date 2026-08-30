import {BrowserRouter, Routes, Route} from "react-router-dom";
import ProductGrid from "./Components/ProductGrid.jsx";
import Navbar from "./Components/Nav_bar.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import Signup from "./Components/Signup.jsx";

function App() {
  const handleSelectItem = (item) => {
    console.log("Selected item:", item);
  };
  
  return (
    <BrowserRouter>
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/" element={<ProductGrid />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
