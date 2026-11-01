/*
  Module: CIT2011 - Web Programming
  Student Name: Nathaniel Sinclair
  Student ID: 2106689
*/

(function () {
  "use strict";

  const STORAGE_KEY = "codingConfTicket";
  const MAX_FILE_SIZE = 500 * 1024;
  const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];

  
  const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const GITHUB_PATTERN = /^@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

  const form = document.getElementById("registration-form");
  if (!form) {
    return;
  }

  
  const avatarInput = document.getElementById("avatar-input");
  const dropzone = document.getElementById("avatar-dropzone");
  const emptyState = document.getElementById("upload-empty-state");
  const previewState = document.getElementById("upload-preview-state");
  const previewImg = document.getElementById("avatar-preview-img");
  const fileInfoText = document.getElementById("avatar-file-info");
  const removeAvatarBtn = document.getElementById("remove-avatar-btn");
  const changeAvatarBtn = document.getElementById("change-avatar-btn");

  const fullNameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email-address");
  const githubInput = document.getElementById("github-handle");

  
  const avatarError = document.getElementById("avatar-error");
  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const githubError = document.getElementById("github-error");

  
  let avatarDataUrl = "";
  let existingSerialNumber = "";

  
  function setFieldError(inputEl, errorEl, message) {
    errorEl.textContent = message;
    if (inputEl) {
      inputEl.setAttribute("aria-invalid", "true");
    }
  }

  
  function clearFieldError(inputEl, errorEl) {
    errorEl.textContent = "";
    if (inputEl) {
      inputEl.removeAttribute("aria-invalid");
    }
  }

  
  function showAvatarPreview(dataUrl, labelText) {
    avatarDataUrl = dataUrl;
    previewImg.src = dataUrl;
    fileInfoText.textContent = labelText || "Avatar ready";
    emptyState.hidden = true;
    previewState.hidden = false;
    dropzone.classList.add("has-preview");
    clearFieldError(avatarInput, avatarError);
  }

  function clearAvatarSelection() {
    avatarDataUrl = "";
    avatarInput.value = "";
    previewImg.src = "assets/image-avatar.jpg";
    fileInfoText.textContent = "";
    previewState.hidden = true;
    emptyState.hidden = false;
    dropzone.classList.remove("has-preview");
  }

  
  function processAvatarFile(file) {
    if (!file) {
      return;
    }

    const fileNameLower = file.name.toLowerCase();
    const hasValidExtension =
      fileNameLower.endsWith(".jpg") ||
      fileNameLower.endsWith(".jpeg") ||
      fileNameLower.endsWith(".png");

    const hasValidMime = ALLOWED_MIME_TYPES.indexOf(file.type) !== -1;

    if (!hasValidMime || !hasValidExtension) {
      clearAvatarSelection();
      setFieldError(
        avatarInput,
        avatarError,
        "Invalid image format. Please choose a JPG or PNG file."
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeKB = Math.round(file.size / 1024);
      clearAvatarSelection();
      setFieldError(
        avatarInput,
        avatarError,
        "File is too large (" + sizeKB + "KB). Maximum allowed size is 500KB."
      );
      return;
    }

    
    const reader = new FileReader();
    reader.onload = function (event) {
      const kbLabel = Math.max(1, Math.round(file.size / 1024)) + " KB";
      showAvatarPreview(event.target.result, file.name + " (" + kbLabel + ")");
    };
    reader.onerror = function () {
      clearAvatarSelection();
      setFieldError(
        avatarInput,
        avatarError,
        "Could not read the selected image file. Please try another photo."
      );
    };
    reader.readAsDataURL(file);
  }

  
  function validateAvatar() {
    if (!avatarDataUrl) {
      
      const finalMsg =
        avatarError.textContent !== ""
          ? avatarError.textContent
          : "Please upload a JPG or PNG avatar photo under 500KB.";
      setFieldError(avatarInput, avatarError, finalMsg);
      return false;
    }
    clearFieldError(avatarInput, avatarError);
    return true;
  }

  function validateFullName() {
    const trimmed = fullNameInput.value.trim();
    if (trimmed.length === 0) {
      setFieldError(
        fullNameInput,
        nameError,
        "Full name is required and cannot consist of empty spaces."
      );
      return false;
    }
    if (trimmed.length < 2) {
      setFieldError(
        fullNameInput,
        nameError,
        "Please enter at least 2 characters for your full name."
      );
      return false;
    }
    clearFieldError(fullNameInput, nameError);
    return true;
  }

  function validateEmail() {
    const trimmed = emailInput.value.trim();
    if (trimmed.length === 0) {
      setFieldError(emailInput, emailError, "Please enter your email address.");
      return false;
    }
    if (!EMAIL_PATTERN.test(trimmed)) {
      setFieldError(
        emailInput,
        emailError,
        "Please enter a valid email address (for example, user@domain.com)."
      );
      return false;
    }
    clearFieldError(emailInput, emailError);
    return true;
  }

  function validateGithub() {
    const trimmed = githubInput.value.trim();
    if (trimmed.length === 0) {
      setFieldError(githubInput, githubError, "Please enter your GitHub username.");
      return false;
    }
    if (trimmed.charAt(0) !== "@") {
      setFieldError(
        githubInput,
        githubError,
        "GitHub username must begin with the @ prefix (e.g., @yourusername)."
      );
      return false;
    }
    if (!GITHUB_PATTERN.test(trimmed)) {
      setFieldError(
        githubInput,
        githubError,
        "Enter a valid GitHub handle after @ using letters, numbers, or single hyphens."
      );
      return false;
    }
    clearFieldError(githubInput, githubError);
    return true;
  }

  
  function createSerialNumber() {
    const randomNum = Math.floor(1000 + Math.random() * 98999);
    const padded = String(randomNum).padStart(5, "0");
    return "#" + padded;
  }

  
  function saveRegistrationState(payload) {
    const serialized = JSON.stringify(payload);
    try {
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (storageErr) {
      try {
        sessionStorage.setItem(STORAGE_KEY, serialized);
        return true;
      } catch (fallbackErr) {
        setFieldError(
          avatarInput,
          avatarError,
          "Browser storage is full. Please try a smaller avatar image."
        );
        return false;
      }
    }
  }

  
  function restoreForEditing() {
    if (window.location.search.indexOf("edit=1") === -1) {
      return;
    }

    const rawData =
      localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return;
    }

    try {
      const saved = JSON.parse(rawData);
      if (saved.fullName) {
        fullNameInput.value = saved.fullName;
      }
      if (saved.email) {
        emailInput.value = saved.email;
      }
      if (saved.github) {
        githubInput.value = saved.github;
      }
      if (saved.serialNumber) {
        existingSerialNumber = saved.serialNumber;
      }
      if (saved.avatarDataUrl) {
        showAvatarPreview(saved.avatarDataUrl, "Saved profile photo");
      }
    } catch (parseErr) {
      
    }
  }

  
  avatarInput.addEventListener("change", function () {
    if (avatarInput.files && avatarInput.files[0]) {
      processAvatarFile(avatarInput.files[0]);
    }
  });

  removeAvatarBtn.addEventListener("click", function () {
    clearAvatarSelection();
    avatarInput.focus();
  });

  changeAvatarBtn.addEventListener("click", function () {
    avatarInput.click();
  });

 

  
  fullNameInput.addEventListener("input", function () {
    if (nameError.textContent !== "") {
      validateFullName();
    }
  });

  emailInput.addEventListener("input", function () {
    if (emailError.textContent !== "") {
      validateEmail();
    }
  });

  githubInput.addEventListener("input", function () {
    if (githubError.textContent !== "") {
      validateGithub();
    }
  });

  
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const isAvatarOk = validateAvatar();
    const isNameOk = validateFullName();
    const isEmailOk = validateEmail();
    const isGithubOk = validateGithub();

    if (!isAvatarOk || !isNameOk || !isEmailOk || !isGithubOk) {
      
      if (!isAvatarOk) {
        avatarInput.focus();
      } else if (!isNameOk) {
        fullNameInput.focus();
      } else if (!isEmailOk) {
        emailInput.focus();
      } else {
        githubInput.focus();
      }
      return;
    }

    const registrationRecord = {
      fullName: fullNameInput.value.trim(),
      email: emailInput.value.trim(),
      github: githubInput.value.trim(),
      avatarDataUrl: avatarDataUrl,
      serialNumber: createSerialNumber(),
      eventDate: "Oct 26, 2026",
      location: "Papine, Kgn"
    };

    if (saveRegistrationState(registrationRecord)) {
      window.location.href = "ticket.html";
    }
  });

  restoreForEditing();
})();
