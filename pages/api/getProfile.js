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

  // Fetch the README from the user's profile repository (same name as username)
  const readmeResponse = await fetch(
    `https://api.github.com/repos/${username}/${username}/contents/README.md`
  );

  let readmeData = null;
  if (readmeResponse.status === 200) {
    const readmeContent = await readmeResponse.json();
    readmeData = atob(readmeContent.content); // Decode README content
  }

  res.status(200).json({
    profile: profileData,
    repos: reposData,
    readme: readmeData,
  });
}
