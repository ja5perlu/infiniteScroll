/**
 * 取得 GitHub 使用者的公開 repo 總數
 * @param {string} username - GitHub 使用者名稱
 * @returns {Promise<number>} repo 總數
 */
export async function fetchUserTotalRepos(username) {
    const url = `https://api.github.com/users/${username}`;
    const headers = {};
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Failed to fetch user info')
    const user = await res.json();
    return user.public_repos;
}
// src/api/github.js

/**
 * 取得 GitHub 使用者的公開 repos
 * @param {string} username - GitHub 使用者名稱
 * @param {number} page - 頁碼 (從 1 開始)
 * @param {number} perPage - 每頁筆數
 * @returns {Promise<Array>} repo 陣列
 */
export async function fetchUserRepos(username, page = 1, perPage = 10) {
    const url = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated`;
    const headers = {};
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    if (token) {
        headers['Authorization'] = `token ${token}`;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('Failed to fetch repos')
    return await res.json()
}
