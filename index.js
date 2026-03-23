const api = "https://api.github.com/users/";

const main = document.getElementById("main");
const inputForm = document.getElementById("userInput");
const inputBox = document.getElementById("inputBox");

const userGetFunction = (name) => {
    axios(api + name)
        .then((response) => {
            userCard(response.data);
            repoGetFunction(name);
        })
        .catch((err) => {
            if (err.response && err.response.status === 404) {
                errorFunction("No profile with this username");
            }
        });
};

const repoGetFunction = (name) => {
    axios(api + name + "/repos?sort=created")
        .then((response) => {
            repoCardFunction(response.data);
        })
        .catch(() => {
            errorFunction("Problem fetching repos");
        });
};

const userCard = (user) => {
    let id = user.name || user.login;
    let info = user.bio ? `<p>${user.bio}</p>` : "";

    main.innerHTML = `
  <div class="card">
    <img src="${user.avatar_url}" class="avatar">
    <div class="user-info">
      <h2>${id}</h2>
      ${info}
      <ul>
        <li>${user.followers} Followers</li>
        <li>${user.following} Following</li>
        <li>${user.public_repos} Repos</li>
      </ul>
      <div id="repos"></div>
    </div>
  </div>`;
};

const repoCardFunction = (repos) => {
    const reposElement = document.getElementById("repos");
    if (!reposElement) return;

    repos.slice(0, 5).forEach((repo) => {
        const repoEl = document.createElement("a");
        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;
        reposElement.appendChild(repoEl);
    });
};

inputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let user = inputBox.value.trim();
    if (!user) return;

    userGetFunction(user);
    inputBox.value = "";
});