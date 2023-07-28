export const deviceInitialization = (evt, message, {
  setInitialized, setError, setDevice, setIssues,
}) => {
  const [field] = Object.keys(message);
  console.log(message);

  if (field === 'initialization' && message.initialization) {
    setInitialized(true);
    return;
  }

  if (message[field]?.error?.critical) {
    setError(message[field].error.critical);
    return;
  }

  if (message[field]?.error?.warn) {
    setIssues(message[field].error.warn);
    return;
  }

  setDevice(message);
};

export const refresh = (evt, message) => {
  if (message === true) {
    window.location.reload();
  }
};

export const sendWgSettings = (settings, ipcRenderer, cb) => {
  ipcRenderer.send('wg-settings', settings);
  ipcRenderer.on('settings-accepted', (evt, message) => { cb(message); });
};
