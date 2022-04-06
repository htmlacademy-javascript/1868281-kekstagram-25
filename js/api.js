const Urls = {
  GET: 'https://25.javascript.pages.academy/kekstagram/data',
  POST: 'https://25.javascript.pages.academy/kekstagram/',
};

const serverRequest = (onSuccess, onFail, method, formData) => {
  fetch(
    Urls[method],
    {
      method: method,
      body: formData,
    },
  )
    .then((response) => {
      if (response.ok) {
        if (method === 'GET') {
          response.json().then(onSuccess);
        }
        if (method === 'POST') {
          onSuccess();
        }
      } else {
        onFail();
      }
    })
    .catch(() => {
      onFail();
    });
};

export {serverRequest};
