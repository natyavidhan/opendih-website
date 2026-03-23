// List of blog json files in src/blogs/
const blogFiles = ["23-03-2026.json", "10-02-2026.json", "01-01-2026.json"];

let isDescending = true;
let blogCache = {};

// Convert dd-mm-yyyy string to Date object
function parseDate(filename) {
  const cleanName = filename.replace(".json", "");
  const [d, m, y] = cleanName.split("-");
  return new Date(y, m - 1, d);
}

// Fetch and display blog list
async function renderBlogs() {
  const container = document.getElementById("blog-container");
  container.innerHTML = "";

  const sorted = [...blogFiles].sort((a, b) => {
    const dateA = parseDate(a);
    const dateB = parseDate(b);
    return isDescending ? dateB - dateA : dateA - dateB;
  });

  for (const file of sorted) {
    try {
      if (!blogCache[file]) {
        const res = await fetch(`src/blogs/${file}`);
        if (!res.ok) continue;
        blogCache[file] = await res.json();
      }

      const data = blogCache[file];
      const dateDisplay = file.replace(".json", "").replace(/-/g, " / ");

      const item = `
                <div class="blog-item" onclick="openBlog('${file}')">
                    <span class="blog-date">${dateDisplay}</span>
                    <span class="blog-title">${data.title}</span>
                    <p style="font-size: 1rem; font-weight:300; margin:0; opacity:0.8;">${data.excerpt}</p>
                </div>
            `;
      container.innerHTML += item;
    } catch (err) {
      console.warn("Error loading blog file:", file);
    }
  }
}

// Populate and show the modal
function openBlog(filename) {
  const data = blogCache[filename];
  const contentArea = document.getElementById("modal-content");

  contentArea.innerHTML = `
        <div class="modal-body-title">${data.title}</div>
        <div class="modal-body-content">${data.content}</div>
    `;

  document.getElementById("modal-overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

// Hide the modal
function closeBlog() {
  document.getElementById("modal-overlay").classList.remove("active");
  document.body.style.overflow = "auto";
}

// Toggle date sorting and refresh list
function toggleSort() {
  isDescending = !isDescending;
  document.getElementById("sort-btn").innerText = isDescending
    ? "Newest First"
    : "Oldest First";
  renderBlogs();
}

// Close modal on escape key
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeBlog();
});

// Run on page load
renderBlogs();
