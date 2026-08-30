import { useState } from "react";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const handleSignup = async (e) => {
    e.preventDefault(); 
    
    const userData = { userName:name, email:email, userPassword:password };

    try {
      const response = await fetch("http://localhost:8081/api/customer_accounts/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData), // Converts React state into JSON
      });

      if (response.ok) {
        alert("Account created successfully!");
        console.log("User data sent:", userData);
        // Optional: clear the form boxes here
        setName("");
        setEmail("");
        setPassword("");
      } else {
        alert("Failed to create account. Email might already exist.");
        console.error("Server Error:", response.statusText);
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Network Error: Could not connect to the backend server.");
    }
  };
  return (
    <div className="container mt-5">
      <h2>Create an Account</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
}