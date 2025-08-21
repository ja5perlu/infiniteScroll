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
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch repos')
    return await res.json()
}
