const API_URL = "http://localhost:3000/api";

// Botones
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addProductBtn = document.getElementById("addProductBtn");

// Secciones
const authSection = document.getElementById("auth");
const productsSection = document.getElementById("productos");
const productList = document.getElementById("productList");

registerBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    alert(data.message || "Usuario registrado");
});

loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include"
    });

    if (res.ok) {
        authSection.style.display = "none";
        productsSection.style.display = "block";
        logoutBtn.style.display = "block";
        loadProducts();
    } else {
        alert("Error al iniciar sesión");
    }
});

logoutBtn.addEventListener("click", async () => {
    await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
    });

    authSection.style.display = "block";
    productsSection.style.display = "none";
    logoutBtn.style.display = "none";
});

addProductBtn.addEventListener("click", async () => {
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;

    await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price }),
        credentials: "include"
    });

    loadProducts();
});

async function loadProducts() {
    const res = await fetch(`${API_URL}/products`, { credentials: "include" });
    const products = await res.json();

    productList.innerHTML = "";
    products.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} - $${p.price}`;
        productList.appendChild(li);
    });
}
