
import React, { useEffect, useState } from 'react';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState('nature');
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    setLoading(true);
    const res = await fetch(
      `https://pixabay.com/api/videos/?key=${import.meta.env.VITE_PIXABAY_API_KEY}&q=${query}`
    );
    const data = await res.json();
    setVideos(data.hits || []);
    setLoading(false);
  };

  const handleFacebookLogin = () => {
    if (!window.FB) return alert('Facebook SDK not loaded.');
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          alert('Logged in with Facebook!');
        } else {
          alert('Login cancelled or not authorized.');
        }
      },
      {
        scope:
          'public_profile,pages_show_list,pages_manage_posts,pages_manage_video',
      }
    );
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Pixabay Facebook Poster</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search videos..."
      />
      <button onClick={fetchVideos}>Search</button>
      <button onClick={handleFacebookLogin}>Login with Facebook</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {videos.map((video) => (
            <video
              key={video.id}
              src={video.videos.tiny.url}
              width="300"
              controls
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
