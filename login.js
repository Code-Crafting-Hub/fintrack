let form = document.querySelector("form");

let user = JSON.parse(localStorage.getItem("registerUser")) || [];

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let name = e.target[0].value;
  let password = e.target[1].value;
  if (name.trim() === "" || password.trim() === "") {
    alert("All fields are required");
    return;
  }
  let name2 = user[0].name;
  let password2 = user[0].password;
  if (name !== name2 || password !== password2) {
    alert("user detail are not matched");
    return;
  }
  let arr = {
    name: name,
    currency: "₹",
  };
  localStorage.setItem("user", JSON.stringify(arr));
  window.location.href = "./index.html";
  form.reset();
});
