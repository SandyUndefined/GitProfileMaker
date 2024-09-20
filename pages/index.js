import { useState } from "react";
import ProfileCard from "../components/ProfileCard";
import TemplateGenerator from "../components/TemplateGenerator";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // Import React Tabs CSS

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
    setReadme(data.readme); // Profile README.md content
  };

  return (
    <div>
      <h1>GitHub Profile Generator</h1>

      {/* Tabs for Profile Search and README Generator */}
      <Tabs>
        <TabList>
          <Tab>Search GitHub Profile</Tab>
          <Tab>README Generator</Tab>
        </TabList>

        {/* Tab for Searching GitHub Profile */}
        <TabPanel>
          <div>
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
          </div>
        </TabPanel>

        {/* Tab for README Generator */}
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
