document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  const isLoginPage =
    window.location.href.endsWith("/") ||
    window.location.href.endsWith("/index.html");

  if (!token) {
    if (!isLoginPage) {
      window.location.href = "../index.html"; // Redirect to login if not authenticated
    }
  } else {
    document.body.style.display = "block";

    if (isLoginPage) {
      window.location.href = "/pages/dashboard.html"; // Redirect to dashboard
    }
  }
});
