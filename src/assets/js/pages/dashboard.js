const createErrorButton = () => {
  const button = document.createElement("button");
  button.textContent = "Error fetching data. Retry";
  button.className = "error-btn";
  button.addEventListener("click", async () => {
    await handleFetchDashboardStatistics();
  });

  return button;
};

const handleFetchDashboardStatistics = async () => {
  const totalUsersElement = document.getElementById("totalUsers");
  const standardSubscriptionsElement = document.getElementById(
    "standardSubscriptions"
  );

  try {
    totalUsersElement.innerText = "Loading...";
    standardSubscriptionsElement.innerText = "Loading...";

    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data?.message || "Login Failed";
      throw new Error(errorMsg);
    }

    totalUsersElement.innerText = data?.data?.total_users || "N/A";
    standardSubscriptionsElement.innerText =
      data?.data?.standard_subscriptions || "N/A";
  } catch (error) {
    const errorMessage = error?.message || "Error fetching data";
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "error",
      title: errorMessage,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });

    totalUsersElement.innerText = "";
    standardSubscriptionsElement.innerText = "";

    const button = createErrorButton();
    const button2 = createErrorButton();
    totalUsersElement.appendChild(button);
    standardSubscriptionsElement.appendChild(button2);
  }
};

const handlePageLoad = async () => {
  const adminNameElement = document.getElementById("adminName");
  const userName = userData?.user?.full_name || "N/A";

  adminNameElement.innerText = userName;

  await handleFetchDashboardStatistics();
};

document.addEventListener("DOMContentLoaded", handlePageLoad);
