import { useState } from 'react';
import { Link } from 'react-router-dom';

function Cart() {
  // Temporary mock cart items (We will connect this to React Context / LocalStorage next)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Mobil 1 - 0W-40 - Advanced Fully Synthetic Motor Oil",
      price: 11850,
      quantity: 2,
      pic: "/default-oil.png" // Update with your actual image path or property
    }
  ]);

  // Handle quantity changes
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  // Handle item removal
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Calculate total price
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Your cart is empty.</p>
          <Link to="/" className="btn btn-primary mt-3">Continue Shopping</Link>
        </div>
      ) : (
        <div className="row">
          {/* Left Side: Cart Items List */}
          <div className="col-lg-8">
            <div className="list-group shadow-sm">
              {cartItems.map((item) => (
                <div key={item.id} className="list-group-item d-flex align-items-center justify-content-between p-3">
                  <div className="d-flex align-items-center gap-3">
                    <img 
                      src={item.pic} 
                      alt={item.name} 
                      style={{ width: '70px', height: '70px', objectFit: 'contain' }} 
                      className="border rounded p-1"
                    />
                    <div>
                      <h5 className="mb-1 fs-6">{item.name}</h5>
                      <p className="text-muted mb-0">Rs. {item.price} each</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    {/* Quantity Selector */}
                    <input 
                      type="number" 
                      className="form-control text-center" 
                      style={{ width: '70px' }} 
                      min="1" 
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    />
                    
                    {/* Item Total */}
                    <span className="fw-bold" style={{ minWidth: '100px', textAlign: 'right' }}>
                      Rs. {item.price * item.quantity}
                    </span>

                    {/* Delete Button */}
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <i className="bi bi-trash"></i> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card p-4 shadow-sm border-0 bg-light">
              <h4 className="mb-3">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
                <span>Total</span>
                <span className="text-primary">Rs. {subtotal}</span>
              </div>

              {/* Proceed to Checkout Button */}
              <button className="btn btn-primary btn-lg w-100">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;