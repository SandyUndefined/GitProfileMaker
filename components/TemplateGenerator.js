import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function TemplateGenerator({ username, profileData, repos }) {
  const [selectedTemplate, setSelectedTemplate] = useState("1");
  const [generatedReadme, setGeneratedReadme] = useState("");
  const [templatePreview, setTemplatePreview] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Build a simple language summary from repo languages.
  const languages = useMemo(() => {
    const langSet = new Set(
      repos.map((repo) => repo.language).filter(Boolean).slice(0, 8)
    );
    const list = Array.from(langSet).join(", ");
    return list || "JavaScript, TypeScript, Node.js";
  }, [repos]);

  // Fetch template preview when the user selects a template
  useEffect(() => {
    const fetchTemplatePreview = async () => {
      const res = await fetch(
        `/api/getTemplatePreview?templateId=${selectedTemplate}`
      );
      const preview = await res.text();
      setTemplatePreview(preview);
    };

    fetchTemplatePreview();
  }, [selectedTemplate]);

  const generateTemplate = async () => {
    if (!profileData) return;
    setIsGenerating(true);

    const repoList = repos
      .map((repo) => `- [${repo.name}](${repo.html_url})`)
      .join("\n");

    const params = new URLSearchParams({
      username,
      templateId: selectedTemplate,
      name: profileData.name || profileData.login,
      bio: profileData.bio || "Open source enthusiast",
      repos: profileData.public_repos,
      followers: profileData.followers,
      following: profileData.following,
      languages,
      repoList: repoList || "- Add some favorite repositories here!",
    });

    const res = await fetch(`/api/getTemplate?${params.toString()}`);
    const template = await res.text();
    setGeneratedReadme(template);
    setIsGenerating(false);
  };

  const downloadReadme = (content) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "README.md";
    link.click();
  };

  const isGenerateDisabled = !profileData || !username.trim() || isGenerating;

  return (
    <div className="generator-shell">
      <div className="generator-header">
        <div>
          <p className="eyebrow">README builder</p>
          <h2>Generate a custom profile README</h2>
          <p>
            Pick a template, blend in your GitHub stats, and download a
            copy-ready README with badges.
          </p>
        </div>
        <div className="generator-meta">
          <p className="muted">Steps</p>
          <ol>
            <li>Search a GitHub user</li>
            <li>Select a template</li>
            <li>Generate & download</li>
          </ol>
        </div>
      </div>

      <div className="generator-grid">
        <div className="panel">
          <div className="panel__header">
            <h3>Template selection</h3>
            <span className="pill">3 options</span>
          </div>
          <div className="template-selector">
            {[1, 2, 3].map((id) => (
              <button
                key={id}
                className={`template-button ${
                  selectedTemplate === String(id) ? "active" : ""
                }`}
                onClick={() => setSelectedTemplate(String(id))}
              >
                <span className="template-id">Template {id}</span>
                <span className="template-note">
                  {id === 1 && "Classic badges & stats"}
                  {id === 2 && "Stack highlights + repo links"}
                  {id === 3 && "Story-driven intro"}
                </span>
              </button>
            ))}
          </div>

          <div className="panel__section">
            <h4>Template preview</h4>
            <div className="template-preview markdown-surface">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {templatePreview}
              </ReactMarkdown>
            </div>
          </div>

          <div className="panel__actions">
            <button onClick={generateTemplate} disabled={isGenerateDisabled}>
              {isGenerating ? "Generating..." : "Generate README"}
            </button>
            {!profileData && (
              <span className="hint">
                Search a GitHub user first to pull stats into the template.
              </span>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel__header">
            <h3>Generated Markdown</h3>
            <span className="pill">Live preview</span>
          </div>
          {generatedReadme ? (
            <>
              <div className="readme-preview markdown-surface">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {generatedReadme}
                </ReactMarkdown>
              </div>
              <div className="panel__actions">
                <button onClick={() => downloadReadme(generatedReadme)}>
                  Download README.md
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>
                Generate a README to see a Markdown preview with your profile
                data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
