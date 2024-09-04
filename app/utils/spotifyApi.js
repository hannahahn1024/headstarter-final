const SpotifyWebApi = require("spotify-web-api-node")

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

async function getAccessToken() {
  const data = await spotifyApi.clientCredentialsGrant()
  spotifyApi.setAccessToken(data.body["access_token"])
}

async function getAlbumArtwork(artistName, songName) {
  try {
    await getAccessToken()
    const searchResult = await spotifyApi.searchTracks(
      `track:${songName} artist:${artistName}`
    )

    if (searchResult.body.tracks.items.length > 0) {
      const track = searchResult.body.tracks.items[0]
      if (track.album.images.length > 0) {
        return track.album.images[0].url
      }
    }
    return null
  } catch (error) {
    console.error("Error retrieving album artwork:", error)
    return null
  }
}

module.exports = { getAlbumArtwork }
