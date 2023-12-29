// Trees per page and current page state
const treesPerPage = 24;
let currentPage = 0;
let svgData;

// Fetch the SVG data
fetch("/icon.svg")
  .then((response) => response.text())
  .then((data) => {
    svgData = data; // Store the fetched SVG data

    // DOM Reference
    const treesContainer = document.querySelector(".trees-container");

    // Calculate and update the number of pages
    const pagesCount = Math.ceil(treesData.length / treesPerPage);

    renderPage(currentPage, treesContainer, pagesCount); // Call renderPage after SVG data is fetched

    // Navigate between pages
    document.querySelector("#prev-button").addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        renderPage(currentPage, treesContainer, pagesCount);
      }
    });

    document.querySelector("#next-button").addEventListener("click", () => {
      if (currentPage < pagesCount - 1) {
        currentPage++;
        renderPage(currentPage, treesContainer, pagesCount);
      }
    });
  });

// Function to render a specific page
const renderPage = (pageNum, treesContainer, pagesCount) => {
  // If SVG hasn't been fetched yet, return
  if (!svgData) return;

  // Calculate start and end indices of trees
  const start = pageNum * treesPerPage;
  const end = Math.min(start + treesPerPage, treesData.length);

  // Clear the contents of treesContainer
  treesContainer.innerHTML = "";

  // Add trees to the treesContainer
  for (let i = start; i < end; i++) {
    const tree = treesData[i];

    // Create new div and populate it with the fetched SVG
    const treeDiv = document.createElement("div");
    treeDiv.innerHTML = svgData;

    // If the SVG was added to the treeDiv, change the color of the SVG
    const svgPath = treeDiv.querySelector("svg path");
    if (svgPath) {
      svgPath.style.fill = `hsl(${tree.hue}, 100%, 50%)`;
    }

    // Apply classes and data attributes to the div
    treeDiv.id = `my-svg-container-${i}`;
    treeDiv.classList.add("tree");
    treeDiv.dataset.customer = tree.customerName;
    treeDiv.dataset.emailCount = tree.emailCount;

    // Append the new div to the trees-container
    treesContainer.appendChild(treeDiv);
  }

  // Disable prev button on the first page and next button on the last page
  document.querySelector("#prev-button").disabled = currentPage === 0;
  document.querySelector("#next-button").disabled =
    currentPage === pagesCount - 1;
};
