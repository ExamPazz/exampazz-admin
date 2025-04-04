document.addEventListener("DOMContentLoaded", () => {
  const originalFetch = window.fetch;

  window.fetch = async (url, options = {}) => {
    const token = userData?.access_token || "";

    const modifiedOptions = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    };

    return originalFetch(url, modifiedOptions);
  };
});
