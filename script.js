if (!localStorage.getItem("user")) {
  window.location.href = "./login.html";
}

document.querySelector("#logout").addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "./login.html";
});

let tranShow = document.querySelector(".add-tran");
let profileSave;

function displayNone() {
  tranShow.style.display = "none";
}

tranShow.addEventListener("click", displayNone);
document.querySelector(".close-btn").addEventListener("click", displayNone);
document.querySelector(".add-tran-card").addEventListener("click", (e) => {
  e.stopPropagation();
});
document.querySelector(".aside-transection").addEventListener("click", () => {
  tranShow.style.display = "flex";
});

let transection = JSON.parse(localStorage.getItem("transection")) || [];

let form = document.querySelector("form");
let balance = document.querySelector("#balance");
let expense = document.querySelector("#expense");
let income = document.querySelector("#income");
let totalTrans = document.querySelector("#transTotal");
let navName = document.querySelector("#userName");

let searchInput = document.getElementById("input-search");
let filterOption = document.getElementById("select-filter");

let section1 = document.getElementById("section1");
let section2 = document.getElementById("section2");
let dashboard = document.getElementById("dashboard");
let settings = document.getElementById("settings");
let sectionForm = document.querySelector("#sec2-form");

searchInput.addEventListener("input", transDetail);
filterOption.addEventListener("change", transDetail);
let transectionDetail = document.querySelector("#tans-detail");

let user = JSON.parse(localStorage.getItem("user"));
let b = 0;
let tranExpense = 0;
let tranIncome = 0;
let userName = user.name;
let currency = user.currency;
section2Form();

dashboard.addEventListener("click", () => {
  section1.style.display = "block";
  section2.style.display = "none";
});

document.getElementById("profileCurrency").value = currency;
settings.addEventListener("click", () => {
  section1.style.display = "none";
  section2.style.display = "block";
});

function section2Form() {
  sectionForm.innerHTML = `
<div class="sec2-in">
  <h4>Profile Details</h4>

  <div class="sec2-form">
    <div class="sec2-form-label">
      <p>Full name</p>
      <input type="text" id="profileName" value="${userName}">
    </div>

    <div class="sec2-form-label">
      <p>Primary Currency</p>
      <select id="profileCurrency">
        <option value="$" ${currency === "$" ? "selected" : ""}>USD ($)</option>
        <option value="₹" ${currency === "₹" ? "selected" : ""}>INR (₹)</option>
        <option value="€" ${currency === "€" ? "selected" : ""}>EUR (€)</option>
        <option value="£" ${currency === "£" ? "selected" : ""}>GBP (£)</option>
        <option value="¥" ${currency === "¥" ? "selected" : ""}>JPY (¥)</option>
      </select>
    </div>
  </div>

  <div class="sec2-form-button">
    <button id="saveProfile">Save Changes</button>
  </div>
</div>
`;
profileSave = document.getElementById("saveProfile");
}

profileSave.addEventListener("click", () => {
  const newName = document.getElementById("profileName").value.trim();
  const newCurrency = document.getElementById("profileCurrency").value;

  user.name = newName;
  user.currency = newCurrency;

  localStorage.setItem("user", JSON.stringify(user));

  userName = newName;
  currency = newCurrency;
  nameUpdate();
  transectionUpdate();
  transDetail();
  renderChart(tranIncome, tranExpense);

  alert("Profile updated successfully!");
});

function transectionUpdate() {
  b = 0;
  tranExpense = 0;
  tranIncome = 0;
  if (transection.length === 0 || !transection) {
    balance.innerText = `${currency} 0.00`;
    expense.innerText = `${currency} 0.00`;
    income.innerText = `${currency} 0.00`;
    totalTrans.innerText = transection.length;
  } else {
    Object.entries(transection).map(([key, value]) => {
      if (value.type === "Expense") {
        tranExpense = tranExpense + Number(value.amount);
      } else {
        tranIncome = tranIncome + Number(value.amount);
      }
    });
    b = tranIncome - tranExpense;
    balance.innerText = `${currency}${b}`;
    expense.innerText = `${currency}${tranExpense}`;
    income.innerText = `${currency}${tranIncome}`;
    totalTrans.innerText = transection.length;
  }
}

function nameUpdate() {
  navName.innerText = `${userName}`;
}

function transDetail() {
  transectionDetail.innerHTML = "";

  const filterValue = filterOption.value;
  const searchValue = searchInput.value.toLowerCase().trim();

  const filtered = transection.filter((item) => {
    const matchesType = filterValue === "All" || item.type === filterValue;

    const matchesSearch =
      item.description.toLowerCase().includes(searchValue) ||
      item.category.toLowerCase().includes(searchValue);

    return matchesType && matchesSearch;
  });

  filtered.forEach((value, index) => {
    const color =
      value.type === "Expense" ? "rgb(199, 0, 0)" : "rgb(5, 145, 0)";
    transectionDetail.innerHTML += `
      <div class="table-main-grid">
        <div class="table-dat">${value.date}</div>
        <div class="table-des">${value.description}</div>
        <div class="table-cat">${value.category}</div>
        <div style="color:${color}; font-weight:600">
          ${currency}${value.amount}
        </div>
        <div class="table-act">
          <i onClick="updateTransection('${value.id}')" class="ri-pencil-fill"></i>
          <i onClick="deleteTransection('${index}')" class="ri-delete-bin-7-fill"></i>
        </div>
      </div>
      <hr>
    `;
  });
}
transDetail();

const ctx = document.getElementById("myChart");

let myChart;

function renderChart(income, expense) {
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "bar",
    label: "Income vs Expense",
    data: {
      labels: ["Income vs Expense"],
      datasets: [
        {
          label: "Income",
          data: [`${tranIncome}`],
          backgroundColor: "#0f9200",
        },
        {
          label: "Expense",
          data: [`${tranExpense}`],
          backgroundColor: "#920000",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

nameUpdate();
transectionUpdate();
renderChart(tranIncome, tranExpense);

let updateIndex = null;

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let type = e.target[0].value;
  let description = e.target[1].value;
  let amount = e.target[2].value;
  let date = e.target[3].value;
  let category = e.target[4].value;

  if (amount.trim() === "" || category.trim() === "") {
    alert("Please fill all the fields");
    return;
  }
  let data = {
    type,
    description,
    amount,
    date,
    category,
    id: Date.now().toString(36) + Math.random().toString(36).substring(2),
  };
  if (updateIndex !== null) {
    transection[updateIndex] = data;
    updateIndex = null;
  } else {
    transection.push(data);
  }
  localStorage.setItem("transection", JSON.stringify(transection));
  transectionUpdate();
  renderChart(tranIncome, tranExpense);
  transDetail();
  tranShow.style.display = "none";
  form.reset();
});

document.querySelector("#reset").addEventListener("click", () => {
  transection = [];
  localStorage.setItem("transection", JSON.stringify(transection));
  transectionUpdate();
  renderChart(0, 0);
  transDetail();
});

const toggle = document.getElementById("toggleSwitch");
const root = document.documentElement;

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    root.style.setProperty("--back", "rgb(15, 23, 42)");
    root.style.setProperty("--card-back", "rgb(31, 41, 55)");
    root.style.setProperty("--text", "rgb(255, 255, 255)");
    root.style.setProperty("--gray", "rgb(153, 153, 153)");
    root.style.setProperty("--aside-hover-back", "rgb(234, 242, 252)");
    root.style.setProperty("--aside-hover-text", "rgb(43, 43, 255)");
    root.style.setProperty("--aside-transection-back", "black");
    root.style.setProperty("--reset-button", "rgb(255, 255, 255)");
  } else {
    root.style.setProperty("--back", "rgb(240, 240, 240)");
    root.style.setProperty("--card-back", "#ffffff");
    root.style.setProperty("--text", "rgb(23, 23, 23)");
    root.style.setProperty("--gray", "rgb(111, 111, 111)");
    root.style.setProperty("--aside-hover-back", "rgb(234, 242, 252)");
    root.style.setProperty("--aside-hover-text", "rgb(43, 43, 255)");
    root.style.setProperty("--aside-transection-back", "black");
    root.style.setProperty("--reset-button", "rgba(255, 0, 0, 0.16)");
  }
});

function updateTransection(id) {
  tranShow.style.display = "flex";
  let tranId = transection.find((elem) => elem.id == id);
  updateIndex = transection.findIndex((elem) => elem.id == id);

  form[0].value = tranId.type;
  form[1].value = tranId.description;
  form[2].value = tranId.amount;
  form[3].value = tranId.date;
  form[4].value = tranId.category;
}

function deleteTransection(index) {
  transection.splice(index, 1);
  localStorage.setItem("transection", JSON.stringify(transection));
  transectionUpdate();
  renderChart(tranIncome, tranExpense);
  transDetail();
}
