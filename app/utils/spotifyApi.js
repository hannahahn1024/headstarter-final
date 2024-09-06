const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

let accessTokenExpirationTime = 0;

async function getAccessToken() {
  const currentTime = Date.now();
  if (currentTime >= accessTokenExpirationTime) {
    try {
      console.log('Attempting to get Spotify access token...');
      console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID);
      console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET ? '[SET]' : '[NOT SET]');
      
      if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
        throw new Error('Spotify credentials are not set properly in environment variables.');
      }

      const data = await spotifyApi.clientCredentialsGrant();
      console.log('Access token received:', data.body['access_token']);
      spotifyApi.setAccessToken(data.body['access_token']);
      accessTokenExpirationTime = currentTime + data.body['expires_in'] * 1000 - 60000;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw error;
    }
  }
}

async function getAlbumArtwork(artistName, songName) {
  try {
    await getAccessToken();
    const searchResult = await spotifyApi.searchTracks(`track:${songName} artist:${artistName}`);

    if (searchResult.body.tracks.items.length > 0) {
      const track = searchResult.body.tracks.items[0];
      if (track.album.images.length > 0) {
        return track.album.images[0].url;
      }
    }
    return null;
  } catch (error) {
    console.error('Error retrieving album artwork:', error);
    throw error;
  }
}

export default getAlbumArtwork;