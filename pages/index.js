import { useState } from "react";
import ProfileCard from "../components/ProfileCard";

export default function Home() {
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState(null);

  const fetchProfile = async () => {
    const res = await fetch(`/api/getProfile?username=${username}`);
    const data = await res.json();
    setProfileData(data);
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
    </div>
  );
}
