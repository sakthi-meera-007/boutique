import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [role, setRole] = useState("admin");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:8081/api/products";

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    fetchProducts();
    loadCart();
  }, []);
//sonar test change
  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  /* ---------------- ADMIN CRUD ---------------- */
  const addOrUpdateProduct = async () => {
    const product = { name, price, stock, category };

    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      setEditingId(null);
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
    }

    setName("");
    setPrice("");
    setStock("");
    setCategory("");
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const editProduct = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setPrice(p.price);
    setStock(p.stock);
    setCategory(p.category);
  };

  /* ---------------- CART LOGIC ---------------- */
  const loadCart = () => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  };

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <div className="container">
      <h1>Boutique Cart Manager</h1>

      {/* ROLE BUTTONS */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setRole("admin")}>Admin</button>
        <button onClick={() => setRole("customer")} style={{ marginLeft: "10px" }}>
          Customer
        </button>
      </div>

      {/* ---------------- ADMIN VIEW ---------------- */}
      {role === "admin" && (
        <>
          <div className="form">
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
            <input placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} />
            <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
            <button onClick={addOrUpdateProduct}>
              {editingId ? "Update Product" : "Add Product"}
            </button>
          </div>

          <ul className="product-list">
            {products.map(p => (
              <li key={p.id} className="product-card">
                <div className="product-info">
                  <b>{p.name}</b> | ₹{p.price} | Stock: {p.stock} | {p.category}
                </div>
                <div className="product-buttons">
                  <button className="update-btn" onClick={() => editProduct(p)}>
                    Update
                  </button>
                  <button className="delete-btn" onClick={() => deleteProduct(p.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* ---------------- CUSTOMER VIEW ---------------- */}
      {role === "customer" && (
        <>
          <h2>Products</h2>
          <ul className="product-list">
            {products.map(p => (
              <li key={p.id} className="product-card">
                <div className="product-info">
                  <b>{p.name}</b> | ₹{p.price} | {p.category}
                </div>
                <button className="update-btn" onClick={() => addToCart(p)}>
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>

          <h2>My Cart</h2>
          {cart.length === 0 && <p>Cart is empty</p>}
          <ul className="product-list">
            {cart.map((item, index) => (
              <li key={index} className="product-card">
                <div className="product-info">
                  <b>{item.name}</b> | ₹{item.price}
                </div>
                <button className="delete-btn" onClick={() => removeFromCart(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;