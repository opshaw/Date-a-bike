var ctxPie = document.getElementById("expensePieChart").getContext("2d");
var noDataMessage = document.querySelector(".no-data-message");

function initPieChart() {
  var expensePieChart = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: ["Total Expense", "Total Income", "Net Balance"],
      datasets: [
        {
          data: [0, 0, 0], // Placeholder data, will be updated dynamically
          backgroundColor: ["#f87544", "#4491f8", "#2aa738"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ": ₹" + tooltipItem.raw;
            },
          },
        },
      },
    },
  });
  return expensePieChart;
}

const expensePieChart = initPieChart();

document.addEventListener("DOMContentLoaded", () => {
  const url = "/api/v1/users/current-user";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const expense = data.data.expense || 0;
      const income = data.data.income || 0;
      const balance = data.data.balance || 0;
      updatePieChart(expense, income, balance);
      console.log("Data fetched successfully");
    })
    .catch((error) => console.log("Error while fetching data:", error));
});
function updatePieChart(expense, income, balance) {
  const expenseData = [expense, income, balance];

  // Check if all data values are zero
  const allZero = expenseData.every((value) => value === 0);

  if (allZero) {
    // Show "No data" message and hide the chart
    noDataMessage.style.display = "block";
    ctxPie.canvas.style.display = "none";
  } else {
    // Hide "No data" message and show the chart
    noDataMessage.style.display = "none";
    ctxPie.canvas.style.display = "block";
  }

  // Update chart data
  expensePieChart.data.datasets[0].data = expenseData;
  expensePieChart.update();
}

document.addEventListener("DOMContentLoaded", () => {
  const url = "/api/v1/users/expense/history"; // Adjust this endpoint to match your actual route
  fetch(url)
      .then(response => response.json())
      .then(data => {
          if (data.success) {
            console.log(data);
              populateExpenseHistory(data.data);
          } else {
              console.error("Error fetching expense history:", data.message);
          }
      })
      .catch(error => console.error("Error fetching data:", error));
});

function populateExpenseHistory(expenses) {
  const tableBody = document.getElementById("expenseHistoryTable").querySelector("tbody");
  tableBody.innerHTML = ""; // Clear existing rows if any

  expenses.forEach((expense, index) => {
      const row = document.createElement("tr");

      // Serial Number
      const serialCell = document.createElement("td");
      serialCell.textContent = index + 1;
      row.appendChild(serialCell);

      // Date
      const dateCell = document.createElement("td");
      dateCell.textContent = new Date(expense.date).toLocaleDateString(); // Formatting date if necessary
      row.appendChild(dateCell);

      // Category
      const categoryCell = document.createElement("td");
      categoryCell.textContent = expense.category;
      row.appendChild(categoryCell);

      // Amount
      const amountCell = document.createElement("td");
      amountCell.textContent = `₹${expense.amount}`;
      row.appendChild(amountCell);

      tableBody.appendChild(row);
  });
}

// Function to initialize the doughnut chart with default data
function initCategoryDoughnutChart() {
  const ctxDoughnut = document
    .getElementById("categoryDoughnutChart")
    .getContext("2d");

  return new Chart(ctxDoughnut, {
    type: "doughnut",
    data: {
      labels: [], // Labels will be set dynamically
      datasets: [
        {
          data: [], // Data will be set dynamically
          backgroundColor: [
            "#4BC0C0","#17c056","#9966FF", "#36A2EB", "#de3a80"
          ],
          hoverBackgroundColor: [
             "#4BC0C0","#17c056","#9966FF", "#36A2EB", "#de3a80"
          ]
        }
      ]
    },
    options: {
      responsive: true,
      cutout: "60%", // Makes it a ring/doughnut chart
      plugins: {
        legend: {
          position: "bottom"
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.label + ": ₹" + tooltipItem.raw;
            }
          }
        }
      }
    }
  });
}

// Initialize the chart
const categoryDoughnutChart = initCategoryDoughnutChart();

// Function to fetch data and update the chart
function updateCategoryDoughnutChart() {
  const url = "/api/v1/users/expense/category"; // Adjust this endpoint to match your actual route
  fetch(url)
    .then(response => response.json())
    .then(responseData => {
      if (responseData.success && Array.isArray(responseData.data)) {
        // Extract categories and amounts
        const categories = responseData.data.map(expense => expense.category);
        const amounts = responseData.data.map(expense => expense.amount);

        // Update chart data
        categoryDoughnutChart.data.labels = categories;
        categoryDoughnutChart.data.datasets[0].data = amounts;
        categoryDoughnutChart.update();
      } else {
        console.error("Failed to retrieve data:", responseData.message);
      }
    })
    .catch(error => console.error("Error fetching category data:", error));
}

// Call the function to fetch data and update the chart on page load
document.addEventListener("DOMContentLoaded", updateCategoryDoughnutChart);


let api = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
const fromDropDown = document.getElementById("from-currency-select");
const toDropDown = document.getElementById("to-currency-select");

//Create dropdown from the currencies array
currencies.forEach((currency) => {
  const option = document.createElement("option");
  option.value = currency;
  option.text = currency;
  fromDropDown.add(option);
});

//Repeat same thing for the other dropdown
currencies.forEach((currency) => {
  const option = document.createElement("option");
  option.value = currency;
  option.text = currency;
  toDropDown.add(option);
});

//Setting default values
fromDropDown.value = "USD";
toDropDown.value = "INR";

let convertCurrency = () => {
  //Create References
  const amount = document.querySelector("#amount").value;
  const fromCurrency = fromDropDown.value;
  const toCurrency = toDropDown.value;

  //If amount input field is not empty
  if (amount.length != 0) {
    fetch(api)
      .then((resp) => resp.json())
      .then((data) => {
        let fromExchangeRate = data.conversion_rates[fromCurrency];
        let toExchangeRate = data.conversion_rates[toCurrency];
        const convertedAmount = (amount / fromExchangeRate) * toExchangeRate;
        result.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
      });
  } else {
    alert("Please fill in the amount");
  }
};

document
  .querySelector("#convert-button")
  .addEventListener("click", convertCurrency);
window.addEventListener("load", convertCurrency);
