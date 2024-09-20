import { useState } from "react";
import ProfileCard from "../components/ProfileCard";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [readme, setReadme] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(1); // Template selector

  const fetchProfile = async () => {
    const res = await fetch(`/api/getProfile?username=${username}`);
    const data = await res.json();
    setProfileData(data.profile);
    setRepos(data.repos);
    setReadme(data.readme); // Profile README.md content
  };

  const generateTemplate = async () => {
    const repoList = repos.map((repo) => `- ${repo.name}`).join("\n");
    const languages = "JavaScript, Python, etc."; // Placeholder, could be dynamic

    const res = await fetch(
      `/api/getTemplate?username=${username}&templateId=${selectedTemplate}&name=${profileData.name}&bio=${profileData.bio}&repos=${profileData.public_repos}&followers=${profileData.followers}&following=${profileData.following}&languages=${languages}&repoList=${repoList}`
    );

    const template = await res.text();
    setReadme(template);
  };

  const downloadReadme = (content) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "README.md";
    link.click();
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

      <div>
        <h3>Select a README Template:</h3>
        <select onChange={(e) => setSelectedTemplate(e.target.value)}>
          <option value="1">Template 1</option>
          <option value="2">Template 2</option>
          <option value="3">Template 3</option>
        </select>
        <button onClick={generateTemplate}>Generate README</button>
      </div>

      {readme && (
        <div>
          <h3>Generated README.md</h3>
          <div className="readme-content">
            <ReactMarkdown>{readme}</ReactMarkdown>
          </div>
          <button onClick={() => downloadReadme(readme)}>
            Download README.md
          </button>
        </div>
      )}
    </div>
  );
}
