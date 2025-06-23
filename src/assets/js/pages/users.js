const createErrorButton = () => {
  const button = document.createElement("button");
  button.textContent = "Error fetching data. Retry";
  button.className = "error-btn";
  button.addEventListener("click", async () => {
    await handleFetchUsers(currentPage, search);
  });

  return button;
};

const mapUsersToTable = (users, usersTableElement) => {
  users.forEach((user) => {
    const row = document.createElement("tr");

    const formattedFullName = user.full_name.split(" ").join("-");
    const email = user.email || "N/A";
    const phoneNumber = user.phone_number || "N/A";
    const gender = user.gender || "N/A";
    const subscription = user.subscription || "N/A";

    row.innerHTML = `
      <td>${user.full_name}</td>
      <td>${email}</td>
      <td>${phoneNumber}</td>
      <td>${gender}</td>
      <td>${subscription}</td>
      <td class="table_row_action">
        <div>
        <button data-id=${user.email} 
        data-email=${user.email} 
        data-fullname=${formattedFullName}
        data-phonenumber=${user.phone_number}
        data-gender=${user.gender}
        class="user-edit-button btn btn-sm btn-primary">Edit</button>
        <button data-id=${user.email} class="user-delete-button btn btn-sm btn-danger">Delete</button>
        </div>
      </td>
    `;

    usersTableElement.appendChild(row);
  });
};

const getPageFromUrl = () => {
  const params = new URLSearchParams(window.location.search);

  const page = parseInt(params.get("page")) || 1;
  const search = params.get("search") || "";

  return { page, search };
};

const updatePageUrl = (page) => {
  const params = new URLSearchParams(window.location.search);
  params.set("page", page);
  history.pushState(null, "", `?${params.toString()}`);
};

const updateSearchUrl = (search) => {
  const params = new URLSearchParams(window.location.search);
  params.set("search", search);
  history.pushState(null, "", `?${params.toString()}`);
};

const rowsPerPage = 20;
let selectedItem = null;
let currentPage = getPageFromUrl().page;
let search = getPageFromUrl().search;

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
      updatePageUrl(page);
      setupPagination(data);
      handleFetchUsers(page, search);
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

const handleFetchUsers = async (currentPage, search) => {
  const usersTableElement = document.querySelector("#usersTable tbody");

  try {
    usersTableElement.innerText = "Loading...";

    const res = await fetch(
      `${API_BASE_URL}/users/data?page=${currentPage}&per_page=${rowsPerPage}&search=${search}`,
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

  await handleFetchUsers(currentPage, search);
};

const handleSearchFormSubmit = (e, searchValue) => {
  e.preventDefault();
  handleFetchUsers(currentPage, searchValue);
  updateSearchUrl(searchValue);
};

const handleSearchForm = async () => {
  try {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");

    searchForm.onsubmit = (e) => handleSearchFormSubmit(e, searchInput.value);
  } catch (error) {}
};

const handleDeleteUser = async () => {
  const deleteDialogYesBtn = document.getElementById("deleteUserDialogYesBtn");

  deleteDialogYesBtn.onclick = async () => {
    console.log({ selectedItem });
  };
};

const handleOpenDeleteDialog = () => {
  document.getElementById("usersTable").addEventListener("click", (e) => {
    const deleteDialog = document.getElementById("deleteUserDialog");

    if (e.target.classList.contains("user-delete-button")) {
      selectedItem = {
        id: e.target.dataset.id,
      };
      deleteDialog.showModal();
    }
  });
};

const handleCloseDeleteDialog = () => {
  const deleteDialog = document.getElementById("deleteUserDialog");
  const deleteDialogNoBtn = document.getElementById("deleteUserDialogNoBtn");
  deleteDialogNoBtn.onclick = () => {
    deleteDialog.close();
  };
};

const handleEditUser = async () => {
  const editDialogForm = document.getElementById("editUserDialog_form");

  editDialogForm.onsubmit = async (e) => {
    e.preventDefault();

    const fullNameValue = document.getElementById(
      "editUserForm_fullName"
    ).value;
    const emailValue = document.getElementById("editUserForm_email").value;
    const phoneNumberValue = document.getElementById(
      "editUserForm_phoneNumber"
    ).value;
    const genderValue = document.getElementById("editUserForm_gender").value;

    console.log({ fullNameValue, emailValue, phoneNumberValue, genderValue });
  };
};

const handleOpenEditDialog = () => {
  document.getElementById("usersTable").addEventListener("click", (e) => {
    const editDialog = document.getElementById("editUserDialog");

    if (e.target.classList.contains("user-edit-button")) {
      selectedItem = {
        id: e.target.dataset.id,
        email: e.target.dataset.email,
        fullName: e.target.dataset.fullname,
        gender: e.target.dataset.gender,
        phoneNumber: e.target.dataset.phonenumber,
      };
      editDialog.showModal();

      document.getElementById("editUserForm_fullName").value =
        e.target.dataset.fullname.split("-").join(" ");
      document.getElementById("editUserForm_email").value =
        e.target.dataset.email;
      document.getElementById("editUserForm_phoneNumber").value =
        e.target.dataset.phonenumber;
      document.getElementById("editUserForm_gender").value =
        e.target.dataset.gender;
    }
  });
};

const handleCloseEditDialog = () => {
  const editDialog = document.getElementById("editUserDialog");
  const editDialogCloseBtn = document.getElementById("editUserDialogCloseBtn");
  editDialogCloseBtn.onclick = () => {
    editDialog.close();
  };
};

document.addEventListener("DOMContentLoaded", () => {
  handlePageLoad();
  handleSearchForm();

  /** Delete functionalities */
  handleDeleteUser();
  handleOpenDeleteDialog();
  handleCloseDeleteDialog();

  /** Edit functionalities */
  handleEditUser();
  handleOpenEditDialog();
  handleCloseEditDialog();
});
