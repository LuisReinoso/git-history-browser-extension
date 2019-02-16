this.isButtonInserted(document.URL);
let oldUrl = document.URL;
// It's necessary because git use pjax to refresh views
// https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes#46428962
window.onload = () => {
  let bodyList = document.querySelector('body');
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (oldUrl != document.URL) {
        if (isButtonInserted(document.URL)) {
        oldUrl = document.URL;
        }
      }
    });
  });

  let config = {
    childList: true,
    subtree: true
  };
  observer.observe(bodyList, config);
};

function isButtonInserted(url) {
  if (/https:\/\/github\.com\/[a-zA-Z0-9-_]*\/[a-zA-Z0-9-_]*\/blob\/.*/.test(url)) {
    const auxUrl = url.split('/');
    auxUrl[2] = 'github.githistory.xyz';
    url = auxUrl.join('/');
    const buttonGithubHistory = document.createElement('a');
    buttonGithubHistory.innerHTML = 'Open in Git History';
    buttonGithubHistory.setAttribute('class', 'btn btn-sm BtnGroup-item');
    buttonGithubHistory.setAttribute('href', url);
    try {
      document
        .getElementById('raw-url')
        .parentNode.appendChild(buttonGithubHistory);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
}