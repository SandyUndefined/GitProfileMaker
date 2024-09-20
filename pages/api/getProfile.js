export default async function handler(req, res) {
  const { username } = req.query;

  // Fetch user profile data
  const profileResponse = await fetch(
    `https://api.github.com/users/${username}`
  );
  const profileData = await profileResponse.json();

  if (profileResponse.status !== 200) {
    return res.status(404).json({ error: "User not found" });
  }

  // Fetch user's repositories
  const reposResponse = await fetch(
    `https://api.github.com/users/${username}/repos`
  );
  const reposData = await reposResponse.json();

  // Check if there is a README file in .github or in any of the repos
  const readmeData = await fetchReadme(username, reposData);

  res.status(200).json({
    profile: profileData,
    repos: reposData,
    readme: readmeData,
  });
}

// Helper function to check for a README.md file in the user's repos
const fetchReadme = async (username, repos) => {
  for (let repo of repos) {
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${username}/${repo.name}/contents/README.md`
    );

    if (readmeResponse.status === 200) {
      const readmeData = await readmeResponse.json();
      return atob(readmeData.content); // Decode the README content
    }
  }
  return null;
};
