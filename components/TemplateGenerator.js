import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function TemplateGenerator({ username, profileData, repos }) {
  const [selectedTemplate, setSelectedTemplate] = useState(1); // Template selector
  const [generatedReadme, setGeneratedReadme] = useState("");

  const generateTemplate = async () => {
    const repoList = repos.map((repo) => `- ${repo.name}`).join("\n");
    const languages = "JavaScript, Python, etc."; // Placeholder, could be dynamic

    const res = await fetch(
      `/api/getTemplate?username=${username}&templateId=${selectedTemplate}&name=${profileData.name}&bio=${profileData.bio}&repos=${profileData.public_repos}&followers=${profileData.followers}&following=${profileData.following}&languages=${languages}&repoList=${repoList}`
    );

    const template = await res.text();
    setGeneratedReadme(template);
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
      <h2>Generate a Custom README.md</h2>

      <div>
        <h3>Select a Template:</h3>
        <select onChange={(e) => setSelectedTemplate(e.target.value)}>
          <option value="1">Template 1</option>
          <option value="2">Template 2</option>
          <option value="3">Template 3</option>
        </select>
        <button onClick={generateTemplate}>Generate README</button>
      </div>

      {generatedReadme && (
        <div>
          <h3>Preview Generated README.md</h3>
          <div className="readme-preview">
            <ReactMarkdown>{generatedReadme}</ReactMarkdown>
          </div>
          <button onClick={() => downloadReadme(generatedReadme)}>
            Download README.md
          </button>
        </div>
      )}
    </div>
  );
}
