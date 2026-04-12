let isSignUp = false;

/* TOGGLE LOGIN / SIGNUP */
function toggleAuth() {
  isSignUp = !isSignUp;

  document.getElementById("authTitle").innerText = isSignUp ? "Create Account" : "Community Login";
  document.querySelector("#authPage button").innerText = isSignUp ? "Sign Up" : "Login";
  document.getElementById("toggleText").innerText = isSignUp
    ? "Already have an account? Login"
    : "Don't have an account? Sign Up";
}

/* HANDLE AUTH */
function handleAuth() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (isSignUp) {
    const exists = users.find(user => user.email === email);

    if (exists) {
      alert("An account with this email already exists.");
      return;
    }

    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", email);
    alert("Account created successfully!");
  } else {
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
      alert("Invalid login details.");
      return;
    }

    localStorage.setItem("currentUser", email);
  }

  loadApp();
}

/* LOGOUT */
function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

/* LOAD APP */
function loadApp() {
  const currentUser = localStorage.getItem("currentUser");

  document.getElementById("authPage").classList.add("hidden");
  document.getElementById("homePage").classList.remove("hidden");
  document.getElementById("navMenu").classList.remove("hidden");
  document.getElementById("welcomeMessage").innerText = `Welcome, ${currentUser}`;

 
}

/* CONVERT IMAGE TO BASE64 */
function getImageBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

/* SUBMIT REPORT */
async function submitReport() {
  const desc = document.getElementById("desc").value.trim();
  const file = document.getElementById("fileInput").files[0];

  if (!desc) {
    alert("Please add a description.");
    return;
  }

  let reports = JSON.parse(localStorage.getItem("reports")) || [];
  let img = "";

  if (file) {
    img = await getImageBase64(file);
  }

  reports.push({
    user: localStorage.getItem("currentUser"),
    text: desc,
    img: img,
    time: Date.now()
  });

  localStorage.setItem("reports", JSON.stringify(reports));

  alert("Report submitted successfully!");
  document.getElementById("desc").value = "";
  document.getElementById("fileInput").value = "";

  loadFeed();
}

/* LOAD FEED */
function loadFeed() {
  let reports = JSON.parse(localStorage.getItem("reports")) || [];
  const feed = document.getElementById("feed");

  feed.innerHTML = "";


  reports
    .slice()
    .reverse()
    .forEach((report) => {
      const li = document.createElement("li");
      li.className = "post";

      const originalIndex = reports.findIndex(r =>
        r.time === report.time &&
        r.user === report.user &&
        r.text === report.text
      );

      li.innerHTML = `
        <button class="btn-delete" onclick="deletePost(${originalIndex})">Delete</button>
        <strong>${report.user}</strong>
        <div class="meta">${new Date(report.time).toLocaleString()}</div>
        <p>${report.text}</p>
        ${report.img ? `<img src="${report.img}" class="post-img" alt="Report Image">` : ""}
      `;

      feed.appendChild(li);
    });

  if (reports.length === 0) {
    feed.innerHTML = "<li class='post'>No reports submitted yet.</li>";
  }
}

/* DELETE REPORT */
function deletePost(index) {
  let reports = JSON.parse(localStorage.getItem("reports")) || [];

  if (confirm("Delete this report?")) {
    reports.splice(index, 1);
    localStorage.setItem("reports", JSON.stringify(reports));
    loadFeed();
  }
}

/* AUTO LOGIN */
window.onload = function () {
  if (localStorage.getItem("currentUser")) {
    loadApp();
  }
};


