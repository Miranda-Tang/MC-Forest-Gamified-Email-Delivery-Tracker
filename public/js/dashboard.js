function sortTable(order) {
  // Highlight the selected button and de-highlight the other
  document
    .getElementById(order === "ascending" ? "descending" : "ascending")
    .classList.remove("selected");
  document.getElementById(order).classList.add("selected");

  fetch("/dashboard?sortOrder=" + order, {
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const tbody = document
        .getElementById("treeTable")
        .getElementsByTagName("tbody")[0];
      tbody.innerHTML = "";
      data.trees.forEach((tree, index) => {
        const row = document.createElement("tr");

        // Add the 'odd-row' or 'even-row' class to each row
        if (index % 2 === 0) {
          row.classList.add("even-row");
        } else {
          row.classList.add("odd-row");
        }

        row.innerHTML = `<td>${tree.customerName}</td><td>${tree.emailCount}</td>`;
        tbody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error:", error));
}

window.onload = function () {
  sortTable("descending");
};
