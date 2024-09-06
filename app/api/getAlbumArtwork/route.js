import getAlbumArtwork from '../../utils/spotifyApi';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const artist = searchParams.get('artist');
  const song = searchParams.get('song');
  
  if (!artist || !song) {
    return new Response(JSON.stringify({ error: 'Artist and song parameters are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    console.log(`Fetching artwork for ${song} by ${artist}`);
    const artworkUrl = await getAlbumArtwork(artist, song);
    if (artworkUrl) {
      return new Response(JSON.stringify({ url: artworkUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: 'Artwork not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error in API route:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch album artwork', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}