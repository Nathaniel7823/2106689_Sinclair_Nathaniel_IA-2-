/*
  Module: CIT2011 - Web Programming
  Name: Nathaniel Sinclair
  Student ID: 2106689
*/

(function () {
  "use strict";

  const STORAGE_KEY = "codingConfTicket";

  
  function loadStoredTicket() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (
        !parsed ||
        !parsed.fullName ||
        !parsed.email ||
        !parsed.github ||
        !parsed.avatarDataUrl
      ) {
        return null;
      }
      return parsed;
    } catch (err) {
      return null;
    }
  }

  
  const ticketData = loadStoredTicket();
  if (!ticketData) {
    window.location.replace("index.html");
    return;
  }

  
  const bannerNameEl = document.getElementById("banner-name");
  const bannerEmailEl = document.getElementById("banner-email");
  const holderNameEl = document.getElementById("ticket-holder-name");
  const githubLinkEl = document.getElementById("ticket-github-link");
  const githubHandleEl = document.getElementById("ticket-github-handle");
  const avatarImgEl = document.getElementById("ticket-avatar");
  const serialEl = document.getElementById("ticket-serial");
  const dateEl = document.getElementById("ticket-date");
  const locationEl = document.getElementById("ticket-location");

  const printBtn = document.getElementById("print-ticket-btn");
  const resetBtn = document.getElementById("reset-ticket-btn");


  
  bannerNameEl.textContent = ticketData.fullName;
  bannerEmailEl.textContent = ticketData.email;
  holderNameEl.textContent = ticketData.fullName;

  const cleanHandle =
    ticketData.github.charAt(0) === "@"
      ? ticketData.github
      : "@" + ticketData.github;
  const profileSlug = cleanHandle.slice(1);

  githubHandleEl.textContent = cleanHandle;
  githubLinkEl.href = "https://github.com/" + encodeURIComponent(profileSlug);
  githubLinkEl.setAttribute(
    "aria-label",
    "Open GitHub profile for " + cleanHandle
  );

  avatarImgEl.src = ticketData.avatarDataUrl;
  avatarImgEl.alt = "Profile photo of " + ticketData.fullName;

  serialEl.textContent = ticketData.serialNumber || "#01609";

  if (ticketData.eventDate && dateEl) {
    dateEl.textContent = ticketData.eventDate;
  }
  if (ticketData.location && locationEl) {
    locationEl.textContent = ticketData.location;
  }

  
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  


  
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.href = "login.html";
    });
  }
})();
