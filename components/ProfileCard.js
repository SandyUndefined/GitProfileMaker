export default function ProfileCard({ profile }) {
  const name = profile.name || profile.login;
  const joinDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : null;
  const publicGists = profile.public_gists ?? null;

  const pillItems = [
    profile.location && { label: profile.location },
    profile.company && { label: profile.company },
    profile.hireable && { label: "Open to work" },
  ].filter(Boolean);

  return (
    <div className="profile-card">
      <div className="profile-card__top">
        <div className="profile-card__hero">
          <img src={profile.avatar_url} alt={name} />
          <div>
            <h2>{name}</h2>
            <p className="profile-card__username">@{profile.login}</p>
            {profile.location && (
              <p className="profile-card__location">{profile.location}</p>
            )}
            {pillItems.length > 0 && (
              <div className="profile-card__pills">
                {pillItems.map((item, idx) => (
                  <span key={idx} className="pill subtle">
                    {item.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="profile-card__actions">
          <a
            className="ghost-button"
            href={profile.html_url}
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
          <span className="pill subtle">Repos: {profile.public_repos}</span>
        </div>
      </div>

      {profile.bio && <p className="profile-card__bio">{profile.bio}</p>}

      <div className="profile-card__stats">
        <div>
          <span className="stat-label">Repos</span>
          <span className="stat-value">{profile.public_repos}</span>
        </div>
        <div>
          <span className="stat-label">Followers</span>
          <span className="stat-value">{profile.followers}</span>
        </div>
        <div>
          <span className="stat-label">Following</span>
          <span className="stat-value">{profile.following}</span>
        </div>
        {publicGists !== null && (
          <div>
            <span className="stat-label">Gists</span>
            <span className="stat-value">{publicGists}</span>
          </div>
        )}
      </div>

      <div className="profile-card__meta">
        {profile.company && (
          <div>
            <span className="meta-label">Company</span>
            <span className="meta-value">{profile.company}</span>
          </div>
        )}
        {profile.blog && (
          <div>
            <span className="meta-label">Website</span>
            <a
              className="meta-value"
              href={
                profile.blog.startsWith("http")
                  ? profile.blog
                  : `https://${profile.blog}`
              }
              target="_blank"
              rel="noreferrer"
            >
              {profile.blog}
            </a>
          </div>
        )}
        {profile.twitter_username && (
          <div>
            <span className="meta-label">Twitter</span>
            <a
              className="meta-value"
              href={`https://twitter.com/${profile.twitter_username}`}
              target="_blank"
              rel="noreferrer"
            >
              @{profile.twitter_username}
            </a>
          </div>
        )}
        {profile.email && (
          <div>
            <span className="meta-label">Email</span>
            <span className="meta-value">{profile.email}</span>
          </div>
        )}
        {joinDate && (
          <div>
            <span className="meta-label">Joined</span>
            <span className="meta-value">{joinDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
