import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ProfileCard from "../components/ProfileCard";
import TemplateGenerator from "../components/TemplateGenerator";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Import React Tabs CSS

export default function Home() {
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [readme, setReadme] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isSearchDisabled = !username.trim();

  const formatUpdated = (dateString) => {
    if (!dateString) return "";
    const updated = new Date(dateString);
    const diffMs = Date.now() - updated.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return "Updated today";
    if (diffDays === 1) return "Updated yesterday";
    if (diffDays < 30) return `Updated ${diffDays}d ago`;
    const diffMonths = Math.floor(diffDays / 30);
    return `Updated ${diffMonths}mo ago`;
  };

  const fetchProfile = async () => {
    if (isSearchDisabled) return;
    setIsLoading(true);
    setError(null);
    setProfileData(null);
    setRepos([]);
    setReadme(null);

    try {
      const res = await fetch(`/api/getProfile?username=${username}`);
      if (!res.ok) {
        setError("Unable to find that user. Double-check the username.");
        return;
      }

      const data = await res.json();
      setProfileData(data.profile);
      setRepos(data.repos || []);
      setReadme(data.readme); // Profile README.md content
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="hero">
        <div className="hero-chip">Profile & README tools</div>
        <h1>GitHub Profile Generator</h1>
        <p>
          Look up any GitHub user, skim their repos, and spin up a polished
          profile README from curated templates.
        </p>
      </header>

      <Tabs>
        <TabList className="tabs">
          <Tab>Search GitHub Profile</Tab>
          <Tab>README Generator</Tab>
        </TabList>

        <TabPanel>
          <div className="search-shell">
            <div className="search-card">
              <div className="search-card__header">
                <p>Find a GitHub profile</p>
                <span>Pull profile stats, top repositories, and profile README.</span>
              </div>
              <label className="input-label" htmlFor="username-input">
                GitHub username
              </label>
              <div className="input-row">
                <input
                  id="username-input"
                  type="text"
                  placeholder="e.g. torvalds"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={fetchProfile} disabled={isSearchDisabled || isLoading}>
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </div>
              <p className="hint">
                Tip: use any public username. Unauthenticated calls may hit rate
                limits on heavy use.
              </p>
              {error && <p className="error-text">{error}</p>}
            </div>

            <div className="results-grid">
              <div className="profile-slot">
                {profileData ? (
                  <ProfileCard profile={profileData} />
                ) : (
                  <div className="empty-state">
                    <p>Search to see profile highlights, repositories, and README.</p>
                  </div>
                )}
              </div>

              <div className="panel repo-card">
                <div className="repo-card__header">
                  <h3>Repositories</h3>
                  <span>{repos.length} public repos</span>
                </div>
                {repos.length > 0 ? (
                  <ul className="repo-list">
                    {repos.map((repo) => {
                      const updatedLabel = formatUpdated(repo.updated_at);

                      return (
                        <li key={repo.id}>
                          <div className="repo-top">
                            <a
                              className="repo-name"
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {repo.name}
                            </a>
                            <div className="repo-meta">
                              <span>★ {repo.stargazers_count ?? 0}</span>
                              <span>⑂ {repo.forks_count ?? 0}</span>
                            </div>
                          </div>
                          {repo.description && (
                            <p className="repo-desc">{repo.description}</p>
                          )}
                          <div className="repo-tags">
                            {repo.language && (
                              <span className="tag">{repo.language}</span>
                            )}
                            {updatedLabel && (
                              <span className="tag subtle">{updatedLabel}</span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="empty-state small">
                    <p>No public repositories found for this user.</p>
                  </div>
                )}
              </div>
            </div>

            {readme && (
              <div className="panel readme-card full-span">
                <div className="panel__header">
                  <h3>Profile README</h3>
                  <span className="pill">@{profileData?.login}</span>
                </div>
                <div className="markdown-surface compact">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                  >
                    {readme}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </TabPanel>

        <TabPanel>
          <TemplateGenerator
            username={username}
            profileData={profileData}
            repos={repos}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}
