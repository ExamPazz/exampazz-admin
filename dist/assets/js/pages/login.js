const loginForm = document.getElementById("loginForm");

const handleLoginSubmit = async (e) => {
  e.preventDefault();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailValue = document.getElementById("loginEmailField").value;
  const passwordValue = document.getElementById("loginPasswordField").value;
  const submitBtn = document.getElementById("loginSubmitBtn");

  if (!emailValue || !passwordValue) {
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "warning",
      title: "Fill in all fields",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });
    return;
  }

  if (!emailRegex.test(emailValue)) {
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "warning",
      title: "Enter valid email address",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });
    return;
  }

  try {
    submitBtn.setAttribute("disabled", "true");
    submitBtn.innerHTML = "LOADING...";

    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailValue, password: passwordValue }),
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMsg = data?.message || "Login Failed";
      throw new Error(errorMsg);
    }

    const stringifiedData = JSON.stringify(data?.data);

    localStorage.setItem(TOKEN_STORAGE_KEY, stringifiedData);
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "success",
      title: "Logged in successfully",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });

    window.location.href = "/pages/dashboard.html";
  } catch (error) {
    const errorMessage = error?.message;
    Swal.fire({
      toast: true,
      position: "bottom-end",
      icon: "error",
      title: errorMessage,
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
    });
  } finally {
    submitBtn.removeAttribute("disabled");
    submitBtn.innerHTML = "LOGIN";
  }
};

loginForm.onsubmit = handleLoginSubmit;
