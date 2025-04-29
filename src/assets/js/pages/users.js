const createErrorButton = () => {
  const button = document.createElement("button");
  button.textContent = "Error fetching data. Retry";
  button.className = "error-btn";
  button.addEventListener("click", async () => {
    await handleFetchUsers();
  });

  return button;
};

const mapUsersToTable = (users, usersTableElement) => {
  users.forEach((user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.full_name}</td>
      <td>${user.email}</td>
      <td>${user.phone_number}</td>
      <td>${user.gender}</td>
      <td>${user.subscription}</td>
    `;

    usersTableElement.appendChild(row);
  });
};

const getPageFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("page")) || 1;
};

const updateUrl = (page) => {
  const params = new URLSearchParams(window.location.search);
  params.set("page", page);
  history.pushState(null, "", `?${params.toString()}`);
};

const rowsPerPage = 20;
let currentPage = getPageFromUrl();

const setupPagination = (data) => {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const pageCount = Math.ceil(data.total / rowsPerPage);

  const createButton = (page) => {
    const btn = document.createElement("button");
    btn.innerText = page;
    btn.classList.add("page-btn");
    if (page === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = page;
      updateUrl(page);
      setupPagination(data);
      handleFetchUsers(page);
    });
    return btn;
  };

  const addEllipsis = () => {
    const ellipsis = document.createElement("span");
    ellipsis.innerText = "...";
    ellipsis.classList.add("ellipsis");
    pagination.appendChild(ellipsis);
  };

  for (let i = 1; i <= pageCount; i++) {
    if (
      i === 1 ||
      i === pageCount ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pagination.appendChild(createButton(i));
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      addEllipsis();
    }
  }
};

const handleFetchUsers = async (currentPage) => {
  const usersTableElement = document.querySelector("#usersTable tbody");

  try {
    usersTableElement.innerText = "Loading...";

    const res = await fetch(
      `${API_BASE_URL}/users/data?page=${currentPage}&per_page=${rowsPerPage}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data?.message || "Login Failed";
      throw new Error(errorMsg);
    }

    usersTableElement.innerText = "";
    const users = data?.data?.data || [];
    const paginationObject = data?.data?.pagination;
    mapUsersToTable(users, usersTableElement);
    setupPagination(paginationObject);
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

    usersTableElement.innerText = "";

    const button = createErrorButton();
    usersTableElement.appendChild(button);
  }
};

const handlePageLoad = async () => {
  const adminNameElement = document.getElementById("adminName");
  const userName = userData?.user?.full_name || "N/A";

  adminNameElement.innerText = userName;

  await handleFetchUsers(currentPage);
};

document.addEventListener("DOMContentLoaded", handlePageLoad);
