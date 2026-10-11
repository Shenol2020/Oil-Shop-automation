import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext.jsx";

function Cart() {
  const getItemId = (item) =>
    item?.pID || item?.product_id || item?.productId || item?.id || item?.p_id;
  const { cartItems, removeFromCart, updateQuantity } = useContext(CartContext);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Your cart is empty.</p>
          <Link to="/" className="btn btn-primary mt-3">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8">
            <div className="list-group shadow-sm">
              {cartItems.map((item) => (
                <div
                  key={item.pID}
                  className="list-group-item d-flex align-items-center justify-content-between p-3"
                >
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.pic}
                      alt={item.p_name}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "contain",
                      }}
                      className="border rounded p-1"
                    />
                    <div>
                      <h5 className="mb-1 fs-6">{item.p_name}</h5>
                      <p className="text-muted mb-0">Rs. {item.price} each</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="number"
                      className="form-control text-center"
                      style={{ width: "70px" }}
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item,
                          item.pID,
                          parseInt(e.target.value) || 1,
                        )
                      }
                    />

                    <span
                      className="fw-bold"
                      style={{ minWidth: "100px", textAlign: "right" }}
                    >
                      Rs. {item.price * item.quantity}
                    </span>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => removeFromCart(getItemId(item))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="card p-4 shadow-sm border-0 bg-light">
              <h4 className="mb-3">Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4 fw-bold fs-5">
                <span>Total</span>
                <span className="text-primary">Rs. {subtotal}</span>
              </div>

              {/* Checkout Button - Ready to hook up to backend */}
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
