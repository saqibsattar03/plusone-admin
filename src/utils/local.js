import axios from 'axios';

export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getUserScopes() {
  const user = localStorage.getItem('user');
  const scopes = JSON.parse(user)?.scopes;
  return scopes ? scopes : null;
}

export function getFullPath(_file) {
  return axios.defaults.baseURL + 'uploads/' + _file;
}
