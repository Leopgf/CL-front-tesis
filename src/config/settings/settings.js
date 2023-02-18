const settings = {
  staging: {
    apiUrl: 'http://127.0.0.1:8000/',
    // apiUrl: 'https://cl-tesis-back.herokuapp.com',
  },
  production: {
    apiUrl: 'https://cl-tesis-back.herokuapp.com',
    // apiUrl: 'http://127.0.0.1:8000/',
  },
};
const getCurrentSettings = (flag) => {
    if(flag) return settings.staging;
    return settings.production;
}

export default getCurrentSettings(true);
