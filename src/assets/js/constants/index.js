const hostname = window.location.hostname;
const isDevelopment =
  hostname.includes("dev.exampazz.com") || hostname.includes("localhost");
const isProduction =
  hostname.includes("exampazz.com") && !hostname.includes(".exampazz.com");

console.log({ hostname, isDevelopment, isProduction });

const BASE_URL = isProduction
  ? "https://api.exampazz.com"
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
logoutBtnElement.addEventListener("click", handleLogout);
