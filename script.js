document.addEventListener("DOMContentLoaded", () => {
  const fallbackImage = document.querySelector(".passport-profile-photo");

  const savedImage = localStorage.getItem("profileImage");

  if (savedImage) {
    fallbackImage.src = savedImage;
  }

  const captureButton = document.getElementById("capture-button");
  const cameraFeed = document.getElementById("camera-feed");

  const profileImages = document.querySelectorAll(".profile-image");

  const popupContainer = document.getElementById("popup-container");

  const closeButton = document.getElementById("close-button");

  function openCameraPopup() {
    accessCamera();

    popupContainer.style.display = "flex";
  }

  function closeCameraPopup() {
    popupContainer.style.display = "none";

    const stream = cameraFeed.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }

    captureButton.disabled = false;
  }

  closeButton.addEventListener("click", closeCameraPopup);

  captureButton.addEventListener("click", takePicture);

  function saveName() {
    const enteredName = document.getElementById("name-input").value;

    const namePattern = /^[a-zA-Z ]{1,30}$/;
    if (!namePattern.test(enteredName)) {
      alert("Please enter a valid name (letters only, max 30 characters).");
      return;
    }

    const passportNameTitle = document.querySelector(".passport-name-title");
    passportNameTitle.textContent = enteredName;

    localStorage.setItem("userName", enteredName);

    closeCameraPopup();
  }

  document.getElementById("capture-button").addEventListener("click", saveName);

  const storedName = localStorage.getItem("userName");
  if (storedName) {
    const passportNameTitle = document.querySelector(".passport-name-title");
    passportNameTitle.textContent = storedName;
  }

  async function accessCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      cameraFeed.srcObject = stream;

      captureButton.disabled = false;

      stream.getVideoTracks()[0].addEventListener("ended", () => {
        closeCameraPopup();
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }

  function takePicture() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = cameraFeed.videoWidth;
    canvas.height = cameraFeed.videoHeight;

    context.drawImage(cameraFeed, 0, 0, canvas.width, canvas.height);

    const capturedImage = canvas.toDataURL("image/png");

    localStorage.setItem("profileImage", capturedImage);

    fallbackImage.src = capturedImage;

    closeCameraPopup();
  }

  profileImages.forEach(function (profileImage) {
    profileImage.addEventListener("click", openCameraPopup);
  });
});
