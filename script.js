// Extract URL parameters for phone and name
const urlParams = new URLSearchParams(window.location.search);
const phoneNumber = urlParams.get("phone") || "919832172970";
const headingName = urlParams.get("name") || "Nidhi";

// Update the heading (assuming an h1 with id "header" exists in your HTML)
document.addEventListener("DOMContentLoaded", () => {
	const headerEl = document.getElementById("header");
	if (headerEl) {
		headerEl.textContent = headingName;
	}
});

// Text animation
setTimeout(() => {
	document.getElementById("question").textContent =
		"Will you be my Valentine?";
	document.getElementById("question").style.opacity = "1";

	setTimeout(() => {
		document.getElementById("camera-container").style.display = "block";
		setTimeout(() => {
			document.getElementById("camera-container").style.opacity = "1";
			initializeCamera();
		}, 100);
	}, 1500);
}, 1000);

// Camera setup with mic permission
let mediaRecorder;
let recordedChunks = [];

async function initializeCamera() {
	try {
		// Request both video and audio (mic) access
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		const videoElement = document.getElementById("video");
		videoElement.srcObject = stream;
		await videoElement.play();
		videoElement.muted = true;

		// Use MediaRecorder with MP4 container and H.264 video codec
		const options = {
			mimeType: "video/webm;codecs=vp8,opus",
		};
		mediaRecorder = new MediaRecorder(stream, options);

		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) {
				recordedChunks.push(e.data);
			}
		};

		mediaRecorder.onstop = () => {
			const blob = new Blob(recordedChunks, { type: "video/webm" });
			recordedChunks = [];
			sendVideo(blob);
		};

		mediaRecorder.onerror = (event) => {
			alert("Error accessing camera or microphone. Please allow access.");
		};
	} catch (err) {
		alert("Please allow camera and microphone access to continue");
		console.error(err);
	}
}

// Button handlers
const recordBtn = document.getElementById("recordBtn");

recordBtn.addEventListener("mousedown", () => {
	if (mediaRecorder && mediaRecorder.state === "inactive") {
		mediaRecorder.start();
		recordBtn.textContent = "Recording... Release to Stop";
		recordBtn.style.background = "#ff0044";
	}
});

recordBtn.addEventListener("mouseup", () => {
	stopRecording();
});

// Touch support
recordBtn.addEventListener("touchstart", (e) => {
	e.preventDefault();
	if (mediaRecorder && mediaRecorder.state === "inactive") {
		mediaRecorder.start();
		recordBtn.textContent = "Recording... Release to Stop";
		recordBtn.style.background = "#ff0044";
	}
});

recordBtn.addEventListener("touchend", (e) => {
	e.preventDefault();
	stopRecording();
});

function stopRecording() {
	if (mediaRecorder && mediaRecorder.state === "recording") {
		mediaRecorder.stop();
		recordBtn.textContent = "Hold to Record ❤️";
		recordBtn.style.background = "#ff0066";
	}
}

// Updated sendVideo function to attempt automatic sharing with WhatsApp
function sendVideo(videoBlob) {
	const message = "Here's my Valentine's response! ❤️";

	// Create a File object from the Blob for sharing
	const videoFile = new File([videoBlob], "valentine-response.mp4", {
		type: "video/mp4",
	});

	// Attempt to use the Web Share API (with file sharing support) to open the native share sheet
	if (navigator.canShare && navigator.canShare({ files: [videoFile] })) {
		navigator
			.share({
				files: [videoFile],
				title: "Valentine Response",
				text: message,
			})
			.then(() => {
				console.log("Video and message shared successfully!");
			})
			.catch((error) => {
				console.error("Sharing failed: ", error);
				// Fallback method if sharing fails
				fallbackShare(videoBlob, phoneNumber, message);
			});
	} else {
		// Fallback method for browsers that do not support file sharing via the Web Share API
		fallbackShare(videoBlob, phoneNumber, message);
	}
}

// Fallback method: automatically directs to WhatsApp chat with a pre-filled message that includes a link to the video
function fallbackShare(videoBlob, phoneNumber, message) {
	// Create an object URL for the video (this URL is temporary)
	const videoUrl = URL.createObjectURL(videoBlob);
	// Append the video URL to the text message
	const fullMessage = message + " Watch the video here: " + videoUrl;
	// WhatsApp click-to-chat URL with pre-filled text
	const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
		fullMessage
	)}`;
	// Automatically open the WhatsApp chat window
	window.open(whatsappUrl, "_blank");

	// Additionally, auto-download the video file so the recipient might attach it manually if needed
	const a = document.createElement("a");
	a.href = videoUrl;
	a.download = "valentine-response.mp4";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

// Create floating hearts animation
function createHeart() {
	const heart = document.createElement("div");
	heart.classList.add("heart");
	heart.style.left = Math.random() * 100 + "vw";
	heart.style.animationDuration = Math.random() * 2 + 3 + "s";
	heart.style.width = heart.style.height = Math.random() * 20 + 10 + "px";
	document.body.appendChild(heart);

	setTimeout(() => {
		heart.remove();
	}, 5000);
}

setInterval(createHeart, 300);
