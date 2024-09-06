import fetch from "node-fetch"

async function getAccessToken() {
  try {
    const response = await fetch("http://localhost:3000/utils/spotify-token")
    if (!response.ok) {
      throw new Error("Failed to fetch access token")
    }
    const data = await response.json()
    return data.access_token
  } catch (error) {
    throw new Error("Error fetching access token: " + error.message)
  }
}

export async function GET(req) {
  const url = new URL(req.url)
  const query = url.searchParams.get("q")

  if (!query) {
    return new Response("Missing query parameter", { status: 400 })
  }

  try {
    const accessToken = await getAccessToken()

    const response = await fetch(
      `https://api.spotify.com/v1/search?type=album&query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      return new Response("Spotify API request failed", {
        status: response.status,
      })
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    return new Response("Error fetching track details: " + error.message, {
      status: 500,
    })
  }
}
