export default async function handler(req, res) {
  const { username } = req.query;

  const response = await fetch(`https://api.github.com/users/${username}`);
  const data = await response.json();

  if (response.status !== 200) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(data);
}
