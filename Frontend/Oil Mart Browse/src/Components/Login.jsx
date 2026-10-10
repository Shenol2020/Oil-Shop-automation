import { useState,useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();     
   
    // Keys must match the @JsonProperty strings in Java model
    const loginData = { email: email, userPassword: password };

    try {
      const response = await fetch("http://localhost:8081/api/customer_accounts/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        // Parse the returned Java object into a JavaScript object
        const userData = await response.json(); 
        
        
        // Save the user's ID to the browser to use during order placement
        localStorage.setItem("currentUserId", userData.userId);
        localStorage.setItem("currentUserName", userData.userName);
        
        // You can later add React Router here to redirect them to the product catalog
        login(); // This changes the global state to true, updating the Navbar
        alert("Login successful! Welcome back, " + userData.userName);
        navigate('/');
        
      } else {
        alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network Error: Could not connect to the backend server.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Account Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input 
            type="email" 
            className="form-control" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Login</button>
      </form>
    </div>
  );
}