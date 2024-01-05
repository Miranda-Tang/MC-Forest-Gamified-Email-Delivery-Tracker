const SEARCH_BOX = document.getElementById("searchBox");
const ASCENDING_BTN = document.getElementById("ascending");
const DESCENDING_BTN = document.getElementById("descending");
const TABLE_BODY = document
  .getElementById("treeTable")
  .getElementsByTagName("tbody")[0];
const ERROR_MESSAGE = "An error occurred while fetching data";

function updateTable(url) {
  fetch(url, { headers: { Accept: "application/json" } })
    .then((response) => response.json())
    .then((data) => {
      TABLE_BODY.innerHTML = "";
      data.trees.forEach((tree, index) => {
        const row = document.createElement("tr");
        row.classList.add(index % 2 === 0 ? "even-row" : "odd-row");
        row.innerHTML = `<td>${tree.customerName}</td><td>${tree.emailCount}</td>`;
        TABLE_BODY.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(ERROR_MESSAGE); // inform the user
    });
}

function sortTable(order) {
  let queryParam = `sortOrder=${order}`;

  if (SEARCH_BOX.value) {
    queryParam += `&customerName=${SEARCH_BOX.value}`;
  }

  (order === "ascending" ? DESCENDING_BTN : ASCENDING_BTN).classList.remove(
    "selected",
  );
  document.getElementById(order).classList.add("selected");

  updateTable("/dashboard?" + queryParam);
}

function searchCustomer() {
  const sortOrder = ASCENDING_BTN.classList.contains("selected")
    ? "ascending"
    : "descending";
  const queryParam = `sortOrder=${sortOrder}&customerName=${SEARCH_BOX.value}`;

  updateTable("/dashboard?" + queryParam);
}

function resetTable() {
  SEARCH_BOX.value = "";
  const sortOrder = ASCENDING_BTN.classList.contains("selected")
    ? "ascending"
    : "descending";

  sortTable(sortOrder);
}

window.onload = function () {
  sortTable("descending");
};
