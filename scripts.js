// Admin and User Codes
const ADMIN_CODE = "2055Towhid100020";
const USER_CODES = ["123Towhid", "Towhid123", "Towhid2025"];

// Initialize Pages Data
let pages = JSON.parse(localStorage.getItem("pages")) || [
  {
    rows: [
      { columns: ["Row 1, Col 1", "Row 1, Col 2"] },
      { columns: ["Row 2, Col 1", "Row 2, Col 2"] },
    ],
  },
];

let currentPage = 1;

// Save Data to Local Storage
function saveToLocalStorage() {
  localStorage.setItem("pages", JSON.stringify(pages));
  alert("Changes Saved Successfully!");
}

// Function to Check Login
function checkLogin() {
  const code = document.getElementById("loginCode").value.trim();
  const loginContainer = document.querySelector(".login-container");
  const userWelcome = document.getElementById("userWelcome");
  const adminDashboard = document.getElementById("adminDashboard");

  if (code === ADMIN_CODE) {
    loginContainer.style.display = "none";
    adminDashboard.style.display = "block";
    loadAdminTable();
    setupPagination("adminPagination");
    alert("Welcome, Admin Towhid!");
  } else if (USER_CODES.includes(code)) {
    loginContainer.style.display = "none";
    userWelcome.style.display = "block";
    loadUserTable();
    setupPagination("userPagination");
    alert("Welcome, Towhid!");
  } else {
    alert("Invalid Code. Please try again.");
  }
}

// Load Table for Admin
function loadAdminTable() {
  const table = document
    .getElementById("editableTable")
    .getElementsByTagName("tbody")[0];
  table.innerHTML = ""; // Clear the table
  const currentRows = pages[currentPage - 1].rows;

  currentRows.forEach((row, rowIndex) => {
    const newRow = table.insertRow();
    row.columns.forEach((colText) => {
      const cell = newRow.insertCell();
      cell.contentEditable = "true"; // Allow content editing for Admin
      cell.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>${colText}</span>
          <button onclick="copyCellText(this)">Copy</button>
        </div>`;
    });
    const actionCell = newRow.insertCell(-1);
    actionCell.innerHTML = `<button onclick="saveChanges(${rowIndex})">Save Changes</button>`;
  });
}

// Load Table for Users
function loadUserTable() {
  const container = document.getElementById("userTableContainer");
  container.innerHTML = ""; // Clear the table
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  const currentRows = pages[currentPage - 1].rows;

  currentRows.forEach((row) => {
    const newRow = document.createElement("tr");
    row.columns.forEach((colText) => {
      const cell = document.createElement("td");
      cell.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>${colText}</span>
          <button onclick="copyCellText(this)">Copy</button>
        </div>`;
      newRow.appendChild(cell);
    });
    tbody.appendChild(newRow);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// Setup Pagination
function setupPagination(paginationId) {
  const paginationContainer = document.getElementById(paginationId);
  paginationContainer.innerHTML = ""; // Clear existing buttons

  pages.forEach((_, index) => {
    const button = document.createElement("button");
    button.innerText = `Page ${index + 1}`;
    button.addEventListener("click", () => {
      currentPage = index + 1;
      if (paginationId === "adminPagination") {
        loadAdminTable();
      } else {
        loadUserTable();
      }
    });
    paginationContainer.appendChild(button);
  });
}

// Add Row (Admin Only)
function addRow() {
  const newRow = { columns: ["New Row, Col 1", "New Row, Col 2"] };
  pages[currentPage - 1].rows.push(newRow);
  saveToLocalStorage(); // Save immediately after adding row
  loadAdminTable();
}

// Add Column (Admin Only)
function addColumn() {
  pages.forEach((page) => {
    page.rows.forEach((row) => {
      row.columns.push(`New Col ${row.columns.length + 1}`);
    });
  });
  saveToLocalStorage(); // Save immediately after adding column
  loadAdminTable();
}

// Add New Page (Admin Only)
function addPage() {
  pages.push({
    rows: [
      {
        columns: [
          `Page ${pages.length + 1}, Col 1`,
          `Page ${pages.length + 1}, Col 2`,
        ],
      },
    ],
  });
  saveToLocalStorage(); // Save immediately after adding new page

  alert("New Page Added!");
  setupPagination("adminPagination");
  loadAdminTable();
}

// Save Changes (Admin Only)
function saveChanges(rowIndex) {
  const table = document
    .getElementById("editableTable")
    .getElementsByTagName("tbody")[0];
  const row = table.rows[rowIndex];
  const updatedColumns = [];

  // Save the content of each column for this row
  for (let i = 0; i < row.cells.length - 1; i++) {
    const cellText = row.cells[i].querySelector("span").innerText;
    updatedColumns.push(cellText);
  }

  // Update the page data with the saved content
  pages[currentPage - 1].rows[rowIndex].columns = updatedColumns;
  saveToLocalStorage(); // Save changes immediately
  alert("Changes Saved Successfully!");
}

// Copy Cell Text Functionality (Users and Admin)
function copyCellText(button) {
  const cellText = button.previousElementSibling.innerText; // Get the text inside the span
  navigator.clipboard
    .writeText(cellText)
    .then(() => alert("Text Copied: " + cellText))
    .catch(() => alert("Failed to Copy. Please try again."));
}

// Logout Functionality
function logout() {
  location.reload(); // Reload the page to reset the state
}
