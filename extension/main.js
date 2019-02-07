let url = chrome ? document.URL : window.location.href;
const auxUrl = url.split('/');
auxUrl[2] = 'github-history.netlify.com'
url = auxUrl.join('/');

const buttonGithubHistory = document.createElement('a');
buttonGithubHistory.innerHTML = 'File history';
buttonGithubHistory.setAttribute('class', 'btn btn-sm BtnGroup-item');
buttonGithubHistory.setAttribute('href', url);
document.getElementById("raw-url").parentNode.appendChild(buttonGithubHistory);