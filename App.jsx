
import React, { useEffect, useState } from 'react';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState('nature');
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  const loadFacebookSDK = () => {
    if (window.FB) {
      setSdkReady(true);
      return;
    }
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v19.0',
      });
      setSdkReady(true);
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  };

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
    if (!window.FB) {
      alert('Facebook SDK not loaded yet.');
      return;
    }
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          alert('✅ Logged in with Facebook!');
        } else {
          alert('❌ Login cancelled or failed.');
        }
      },
      {
        scope:
          'public_profile,pages_show_list,pages_manage_posts,pages_manage_video',
      }
    );
  };

  useEffect(() => {
    loadFacebookSDK();
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
      <button onClick={handleFacebookLogin} disabled={!sdkReady}>
        {sdkReady ? 'Login with Facebook' : 'Loading Facebook SDK...'}
      </button>
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
