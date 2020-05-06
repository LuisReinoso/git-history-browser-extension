let oldUrl = '';
switch (location.hostname) {
  case 'github.com':
    this.isButtonInsertedGithub(document.URL);
    document.addEventListener('pjax:end', () => isButtonInsertedGithub(document.URL));
    break;
  case 'bitbucket.org':
    // TODO: search event listener similar to github.
    setTimeout(() => {
      this.isButtonInsertedBitbucket(document.URL);
    }, 1000)
    oldUrl = document.URL;
    // It's necessary because git use pjax to refresh views
    // https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes#46428962
    window.onload = () => {
      let bodyList = document.querySelector('body');
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (oldUrl != document.URL) {
            if (isButtonInsertedBitbucket(document.URL)) {
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
    break;
  case 'gitlab.com':
    this.isButtonInsertedGitlab(document.URL);
    break;
  default:
    break;
}

function isButtonInsertedBitbucket(url) {
  if (
    /https:\/\/bitbucket\.org\/[a-zA-Z0-9-_\.]*\/[a-zA-Z0-9-_\.]*\/src\/[a-zA-Z0-9-_\.]*\/.*/.test(
      url
    )
  ) {
    const auxUrl = url.split('/');
    const lastUrlItemIndex = auxUrl[auxUrl.length];
    const isNotAFile = auxUrl[lastUrlItemIndex] === ''; 
    if (isNotAFile) {
      return false;
    }
    
    auxUrl[2] = 'bitbucket.githistory.xyz';
    url = auxUrl.join('/');
    const buttonWrapper = document.createElement('div');
    const buttonGitHistory = document.createElement('a');
    buttonGitHistory.innerHTML = 'Open in Git History';
    buttonGitHistory.setAttribute(
      'class',
      'css-1puxblk'
    );
    buttonGitHistory.setAttribute('type', 'button');
    buttonGitHistory.setAttribute('href', url);
    buttonWrapper.appendChild(buttonGitHistory);
    
    buttonGitHistory.onmouseover = function() {
      this.style.background = "rgba(9, 30, 66, 0.08)";
      this.style.cursor = "pointer";
    }
    
    buttonGitHistory.onmouseout = function() {
      this.style.background = "rgba(9, 30, 66, 0.04)";
      this.style.cursor = "default";
    }
    
    try {
      document.getElementsByClassName('css-1dgu707 e1fwoj8y0')[0].appendChild(buttonWrapper);  
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  } else {
    return false;
  }
}

function isButtonInsertedGitlab(url) {
  if (
    /https:\/\/gitlab\.com\/[a-zA-Z0-9-_\.]*\/[a-zA-Z0-9-_\.]*\/-\/blob\/.*/.test(
      url
    )
  ) {
    const auxUrl = url.split('/');
    auxUrl[2] = 'gitlab.githistory.xyz';
    url = auxUrl.join('/');
    const buttonGitHistory = document.createElement('a');
    buttonGitHistory.innerHTML = 'Open in Git History';
    buttonGitHistory.setAttribute('class', 'btn btn-default btn-sm');
    buttonGitHistory.setAttribute('href', url.replace('/-/','/'));
    try {
      document
        .getElementsByClassName('file-actions')[0]
        .childNodes[3].appendChild(buttonGitHistory);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
}

function isButtonInsertedGithub(url) {
  if (
    /https:\/\/github\.com\/[a-zA-Z0-9-_\.]*\/[a-zA-Z0-9-_\.]*\/blob\/.*/.test(
      url
    )
  ) {
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
