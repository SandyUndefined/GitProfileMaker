import { useState } from "react";
import ProfileCard from "../components/ProfileCard";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [readme, setReadme] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateFields, setTemplateFields] = useState({
    name: "",
    project: "",
    learning: "",
    topics: "",
    email: "",
    linkedin: "",
    twitter: "",
    languages: "",
    tools: "",
  });


  const fetchProfile = async () => {
    const res = await fetch(`/api/getProfile?username=${username}`);
    const data = await res.json();
    setProfileData(data.profile);
    setRepos(data.repos);
    setReadme(data.readme); // Profile README.md content
  };

  const generateReadme = async () => {
    if (selectedTemplate) {
      const res = await fetch(`/readme-templates/${selectedTemplate}.md`);
      let template = await res.text();

      // Replace placeholders in the template with user data
      template = template
        .replace("{{name}}", templateFields.name)
        .replace("{{project}}", templateFields.project)
        .replace("{{learning}}", templateFields.learning)
        .replace("{{email}}", templateFields.email)
        .replace("{{linkedin}}", templateFields.linkedin)
        .replace("{{twitter}}", templateFields.twitter);

      setReadme(template);
    }
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

      <div>
        <h3>Select a README Template:</h3>
        <select onChange={(e) => setSelectedTemplate(e.target.value)}>
          <option value="">Select Template</option>
          <option value="template1">Template 1</option>
          <option value="template2">Template 2</option>
          <option value="template3">Template 3</option>
        </select>
      </div>

      {selectedTemplate && (
        <div>
          <h3>Fill in Template Details:</h3>
          <input
            type="text"
            placeholder="Your Name"
            value={templateFields.name}
            onChange={(e) =>
              setTemplateFields({ ...templateFields, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Current Project"
            value={templateFields.project}
            onChange={(e) =>
              setTemplateFields({ ...templateFields, project: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Currently Learning"
            value={templateFields.learning}
            onChange={(e) =>
              setTemplateFields({ ...templateFields, learning: e.target.value })
            }
          />
          {/* Add more inputs for other fields as necessary */}
        </div>
      )}

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
          <h3>Generated README.md</h3>
          <pre>{readme}</pre>
          <button onClick={() => navigator.clipboard.writeText(readme)}>
            Copy to Clipboard
          </button>
          <button
            onClick={() => {
              const blob = new Blob([readme], {
                type: "text/plain;charset=utf-8",
              });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "README.md";
              link.click();
            }}
          >
            Download README
          </button>
        </div>
      )}

      {readme && (
        <div>
          <h3>Profile README.md</h3>
          <div className="readme-content">
            <ReactMarkdown>{readme}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
