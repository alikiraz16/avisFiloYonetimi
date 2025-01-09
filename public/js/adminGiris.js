const adminCredentials = {
    username: "admin",
    password: "1234",
};


document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    if (username === adminCredentials.username && password === adminCredentials.password) {
        errorMessage.style.display = "none";
        window.location.href = "adminPanel.html";
    } else {
        errorMessage.textContent = "Hatalı kullanıcı adı veya şifre!";
        errorMessage.style.display = "block";
    }
});