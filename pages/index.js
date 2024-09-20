import { useState } from "react";
import ProfileCard from "../components/ProfileCard";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [readme, setReadme] = useState(null);

  const fetchProfile = async () => {
    const res = await fetch(`/api/getProfile?username=${username}`);
    const data = await res.json();
    setProfileData(data.profile);
    setRepos(data.repos);
    setReadme(data.readme);
  };

  return (
    <div>
      <h1>GitHub Profile Generator</h1>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={fetchProfile}>Fetch Profile</button>

      {profileData && <ProfileCard profile={profileData} />}

      {repos.length > 0 && (
        <div>
          <h3>Repositories:</h3>
          <ul>
            {repos.map((repo) => (
              <li key={repo.id}>{repo.name}</li>
            ))}
          </ul>
        </div>
      )}

      {readme && (
        <div>
          <h3>README.md</h3>
          <div className="readme-content">
            <ReactMarkdown>{readme}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
