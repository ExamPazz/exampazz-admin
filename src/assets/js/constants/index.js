const devAdminUrl = "dev-admin.exampazz.com";
const stagingAdminUrl = "staging-admin.exampazz.com";
const prodAdminUrl = "admin.exampazz.com";

const hostname = window.location.hostname;
const isDevelopment =
  hostname.includes(devAdminUrl) || hostname.includes("localhost");
const isStaging = hostname.includes(stagingAdminUrl) && !isDevelopment;
const isProduction =
  hostname.includes(prodAdminUrl) && !isDevelopment && !isStaging;

const BASE_URL = isProduction
  ? "https://api.exampazz.com"
  : isStaging
  ? "https://apistaging.exampazz.com"
  : "https://apidev.exampazz.com";

const API_BASE_URL = `${BASE_URL}/api/v1/admin`;
const TOKEN_STORAGE_KEY = "user_data";

const userDataInStorage = localStorage.getItem(TOKEN_STORAGE_KEY);
const userData = userDataInStorage ? JSON.parse(userDataInStorage) : "";

const handleLogout = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.location.href = "../index.html";
};

const logoutBtnElement = document.getElementById("logoutBtn");
logoutBtnElement?.addEventListener("click", handleLogout);
