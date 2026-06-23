function ProfileCard({ profile }) {
  const firstLetter = profile.name ? profile.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="card hover-card">
      <p className="card-title">Profile</p>

      <div className="profile-row">
        {profile.avatar ? (
          <img
            src={profile.avatar}
            alt={profile.name}
            className="profile-avatar"
            onError={(e) => { e.target.style.display = "none"; }}
          />
        ) : (
          <div className="avatar-placeholder">{firstLetter}</div>
        )}

        <div className="profile-info">
          <h2>{profile.name || profile.username}</h2>
          <p className="profile-handle">@{profile.username}</p>

          <div className="profile-meta">
            {profile.ranking && (
              <span className="meta-item">🏆 Rank #{profile.ranking.toLocaleString()}</span>
            )}
            {profile.country && (
              <span className="meta-item">🌍 {profile.country}</span>
            )}
            {profile.company && (
              <span className="meta-item">🏢 {profile.company}</span>
            )}
            {profile.school && (
              <span className="meta-item">🎓 {profile.school}</span>
            )}
          </div>

          {profile.about && profile.about.trim() && (
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "8px" }}>
              {profile.about}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
