const categories = [
    "Rent / Mortgage", "Groceries", "Utilities", "Transportation",
    "Insurance", "Healthcare", "Dining Out", "Subscriptions",
    "Education / Courses", "Savings & Investments"
  ];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const allData = {};
  const expenseRows = document.getElementById("expenseRows");
  const monthSelect = document.getElementById("monthSelect");
  let pieChart;

  function renderInputs() {
    expenseRows.innerHTML = "";
    categories.forEach((cat, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${idx + 1}</td>
        <td>${cat}</td>
        <td><input type="number" placeholder="" /></td>
      `;
      expenseRows.appendChild(row);
    });
  }

  function getCurrentInputs() {
    const inputs = expenseRows.querySelectorAll("input");
    return Array.from(inputs).map(input => input.value === "" ? 0 : parseFloat(input.value));
  }

  function saveData(month) {
    const inputs = getCurrentInputs();
    allData[month] = inputs;
  }

  function fillInputs(month) {
    const inputs = expenseRows.querySelectorAll("input");
    const data = allData[month] || Array(categories.length).fill(0);
    inputs.forEach((input, i) => input.value = data[i] !== 0 ? data[i] : "");
    updateChart(data);
  }

  function updateChart(data) {
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(document.getElementById("pieChart"), {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          data: data,
          backgroundColor: [
            '#ff6384', '#36a2eb', '#ffcd56', '#4bc0c0',
            '#9966ff', '#ff9f40', '#66bb6a', '#e57373',
            '#9575cd', '#f06292'
          ]
        }]
      }
    });
  }

  document.getElementById("financeForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const month = monthSelect.value;
    if (!month) return alert("Please select a month!");
    saveData(month);
    alert("Data saved for " + month);
    updateChart(allData[month]);
  });

  let currentMonth = "";

  monthSelect.addEventListener("change", function () {
    const selected = this.value;

    // Save current month data before switching
    if (currentMonth && currentMonth !== selected) {
      saveData(currentMonth);
    }

    renderInputs();
    fillInputs(selected);
    currentMonth = selected;
  });

  function downloadExcel() {
    const dataToExport = [];

    categories.forEach((cat, i) => {
      const row = { Category: cat };
      months.forEach(month => {
        const val = allData[month]?.[i];
        row[month] = val !== undefined ? val : "N/A";
      });
      dataToExport.push(row);
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Yearly Expenses");
    XLSX.writeFile(wb, "MyBudgetAI_Yearly_Expenses.xlsx");
  }

  renderInputs();