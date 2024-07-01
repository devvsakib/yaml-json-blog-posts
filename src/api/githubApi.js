// src/api/githubApi.js
import axios from 'axios';
import yaml from 'js-yaml';

const GITHUB_API_URL = 'https://api.github.com';
const REPO_OWNER = 'devvsakib';
const REPO_NAME = 'yaml-json-blog-posts';
const ACCESS_TOKEN = 'your-personal-access-token';
const CONTENT_PATH = 'path-to-your-blog-posts-folder';

const githubApi = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Authorization: `token ${ACCESS_TOKEN}`,
  },
});

export const fetchFiles = async () => {
  const response = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_PATH}`);
  return response.data;
};

export const fetchFileContent = async (filePath) => {
  const response = await githubApi.get(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`);
  const content = atob(response.data.content);
  if (filePath.endsWith('.json')) {
    return JSON.parse(content);
  } else {
    return yaml.load(content);
  }
};

export const uploadFile = async (fileContent, fileName) => {
  const base64Content = btoa(fileContent);
  const response = await githubApi.put(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_PATH}/${fileName}`, {
    message: `Add ${fileName}`,
    content: base64Content,
  });
  return response.data;
};
