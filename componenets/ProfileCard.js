export default function ProfileCard({ profile }) {
  return (
    <div className="profile-card">
      <img src={profile.avatar_url} alt={profile.name} />
      <h2>{profile.name}</h2>
      <p>{profile.bio}</p>
      <p>Followers: {profile.followers}</p>
      <p>Following: {profile.following}</p>
    </div>
  );
}
