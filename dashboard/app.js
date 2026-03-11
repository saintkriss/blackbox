const DATA_PATH = "./data/sites.json";
const SCREENSHOT_REFRESH_MS = 10 * 60 * 1000;

const state = {
  sites: [],
};

const tableBody = document.querySelector("#sitesTable tbody");
const rowTemplate = document.getElementById("siteRowTemplate");
const refreshBtn = document.getElementById("refreshBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");

function mshotUrl(siteUrl) {
  const encoded = encodeURIComponent(siteUrl);
  return `https://s.wordpress.com/mshots/v1/${encoded}?w=320&h=200`;
}

function formatStatus(status) {
  if (status === "Online") {
    return `<span class="status-online">Online</span>`;
  }
  return `<span class="status-offline">Offline</span>`;
}

function renderTable() {
  tableBody.innerHTML = "";

  state.sites.forEach((site) => {
    const fragment = rowTemplate.content.cloneNode(true);
    const row = fragment.querySelector("tr");
    const thumb = fragment.querySelector(".site-thumb");
    const siteLink = fragment.querySelector(".site-link");
    const adminLink = fragment.querySelector(".admin-link");

    thumb.src = `${mshotUrl(site.url)}&_=${Date.now()}`;
    thumb.alt = `${site.name} screenshot`;

    siteLink.textContent = site.name;
    siteLink.href = site.url;

    adminLink.href = site.adminLoginUrl;

    row.querySelector('[data-field="wpVersion"]').textContent = site.wpVersion;
    row.querySelector('[data-field="sslStatus"]').textContent = site.sslStatus;
    row.querySelector('[data-field="users"]').textContent = site.users;
    row.querySelector('[data-field="phpVersion"]').textContent = site.phpVersion;
    row.querySelector('[data-field="status"]').innerHTML = formatStatus(site.status);
    row.querySelector('[data-field="httpCode"]').textContent = site.httpCode;
    row.querySelector('[data-field="uptime"]').textContent = site.uptime;
    row.querySelector('[data-field="lastBackup"]').textContent = site.lastBackup;
    row.querySelector('[data-field="pluginUpdates"]').textContent = site.pluginUpdates;
    row.querySelector('[data-field="coreUpdates"]').textContent = site.coreUpdates;
    row.querySelector('[data-field="themeUpdates"]').textContent = site.themeUpdates;
    row.querySelector('[data-field="diskUsage"]').textContent = site.diskUsage;
    row.querySelector('[data-field="responseTimeMs"]').textContent = site.responseTimeMs;
    row.querySelector('[data-field="lastChecked"]').textContent = site.lastChecked;

    tableBody.appendChild(fragment);
  });
}

function downloadCsv() {
  const headers = [
    "Site Name",
    "URL",
    "WordPress Version",
    "SSL Status",
    "Users",
    "PHP Version",
    "Status",
    "HTTP Code",
    "Uptime",
    "Last Backup",
    "Plugin Updates",
    "Core Updates",
    "Theme Updates",
    "Disk Usage",
    "Response Time",
    "Last Checked",
    "Admin Login URL",
  ];

  const rows = state.sites.map((site) => [
    site.name,
    site.url,
    site.wpVersion,
    site.sslStatus,
    site.users,
    site.phpVersion,
    site.status,
    site.httpCode,
    site.uptime,
    site.lastBackup,
    site.pluginUpdates,
    site.coreUpdates,
    site.themeUpdates,
    site.diskUsage,
    site.responseTimeMs,
    site.lastChecked,
    site.adminLoginUrl,
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "wordpress-dashboard-export.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function loadData() {
  const response = await fetch(DATA_PATH, { cache: "no-store" });
  state.sites = await response.json();
  renderTable();
}

refreshBtn.addEventListener("click", loadData);
exportCsvBtn.addEventListener("click", downloadCsv);

setInterval(() => {
  loadData().catch(console.error);
}, SCREENSHOT_REFRESH_MS);

loadData().catch(console.error);
