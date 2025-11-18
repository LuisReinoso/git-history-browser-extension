let oldUrl = '';
switch (location.hostname) {
  case 'github.com':
    document.addEventListener('turbo:load', () => {
      isButtonInsertedGithub(document.URL);
    });
    break;
  case 'bitbucket.org':
    // TODO: search event listener similar to github.
    setTimeout(() => {
      this.isButtonInsertedBitbucket(document.URL);
    }, 1000);
    oldUrl = document.URL;
    // It's necessary because git use pjax to refresh views
    // https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes#46428962
    window.onload = () => {
      let bodyList = document.querySelector('body');
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (oldUrl != document.URL) {
            if (isButtonInsertedBitbucket(document.URL)) {
              oldUrl = document.URL;
            }
          }
        });
      });

      let config = {
        childList: true,
        subtree: true,
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
    buttonGitHistory.setAttribute('class', 'css-1puxblk');
    buttonGitHistory.setAttribute('type', 'button');
    buttonGitHistory.setAttribute('href', url);
    buttonWrapper.appendChild(buttonGitHistory);

    buttonGitHistory.onmouseover = function () {
      this.style.background = 'rgba(9, 30, 66, 0.08)';
      this.style.cursor = 'pointer';
    };

    buttonGitHistory.onmouseout = function () {
      this.style.background = 'rgba(9, 30, 66, 0.04)';
      this.style.cursor = 'default';
    };

    try {
      document
        .getElementsByClassName('css-1dgu707 e1fwoj8y0')[0]
        .appendChild(buttonWrapper);
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
    buttonGitHistory.setAttribute('href', url.replace('/-/', '/'));
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
    !/https:\/\/github\.com\/[a-zA-Z0-9-_\.]*\/[a-zA-Z0-9-_\.]*\/blob\/.*/.test(
      url
    )
  ) {
    return false;
  }

  try {
    if (document.querySelector('.git-history-button')) {
      return true;
    }

    const githubUiWrapper = document.querySelector('.react-blob-header-edit-and-raw-actions');
    if (!githubUiWrapper) {
      return false;
    }

    const auxUrl = url.split('/');
    auxUrl[2] = 'github.githistory.xyz';
    const historyUrl = auxUrl.join('/');

    const wrapper = document.createElement('div');
    const button = document.createElement('a');

    button.classList.add('git-history-button');
    button.href = historyUrl;
    button.target = '_blank';

    const buttonContent = document.createElement('span');
    buttonContent.setAttribute('data-component', 'buttonContent');
    buttonContent.setAttribute('data-align', 'center');
    buttonContent.className = 'prc-Button-ButtonContent-HKbr-';

    const buttonText = document.createElement('span');
    buttonText.setAttribute('data-component', 'text');
    buttonText.className = 'prc-Button-Label-pTQ3x';
    buttonText.textContent = 'Open in Git History';

    buttonContent.appendChild(buttonText);
    button.appendChild(buttonContent);

    button.className = 'prc-Button-ButtonBase-c50BI LinkButton-sc-1v6zkmg-0 iwmTUC git-history-button';
    button.setAttribute('data-loading', 'false');
    button.setAttribute('data-no-visuals', 'true');
    button.setAttribute('data-size', 'small');
    button.setAttribute('data-variant', 'default');

    wrapper.appendChild(button);

    const firstButtonGroup = githubUiWrapper.querySelector('.prc-ButtonGroup-ButtonGroup-vcMeG');
    if (firstButtonGroup) {
      firstButtonGroup.parentNode.insertBefore(wrapper, firstButtonGroup.nextSibling);
    } else {
      githubUiWrapper.appendChild(wrapper);
    }

    return true;
  } catch (error) {
    return false;
  }
}
