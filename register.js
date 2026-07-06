let form = document.querySelector("form");

let auth = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = e.target[0].value;
  let password = e.target[1].value;
  if (name.trim() === "" || password.trim() === "") {
    alert("All fields are required");
    return;
  }
  let data = {
    name: name,
    password: password,
    currency: "₹",
  };
  auth.push(data);
  localStorage.setItem("registerUser", JSON.stringify(auth));
  window.location.href = "./login.html";
  form.reset();
});
