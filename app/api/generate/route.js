import { NextResponse } from "next/server"
import OpenAI from "openai"

const systemPrompt = `You are a music recommendation and playlist creation bot designed to provide users with personalized song recommendations or curated playlists based on their favorite songs, artists, and music preferences. When a user provides you with details about their favorite songs, artists, genres, or mood, your task is to analyze the information and generate either a single song recommendation or a playlist of new songs that match their musical taste. Consider factors such as the style, tempo, genre, and emotional tone of the provided music to ensure that the recommendations align with the user's preferences. Aim to introduce them to new music they are likely to enjoy, while also staying true to the essence of what they love about their current favorites.

Your response should be a valid JSON string in the following format:
{
  "songs": [
    {
      "name": "Song Name",
      "artist": "Artist Name"
    }
  ]
}

If generating a single song recommendation, return an array with one item. If generating a playlist, return an array with multiple items (5-10 songs).`

export async function POST(req) {
  const openai = new OpenAI()
  const data = await req.json()

  const { songs, artists, type } = data

  const userPrompt = `Generate a ${
    type === "song" ? "single song recommendation" : "playlist"
  } based on the following:
    Favorite Songs: ${songs.filter(Boolean).join(", ")}
    Favorite Artists: ${artists.filter(Boolean).join(", ")}
    
    Remember to respond with a valid JSON string as specified in the system prompt.`

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "gpt-4",
    })

    const content = completion.choices[0].message.content
    const result = JSON.parse(content)

    if (!result.songs || !Array.isArray(result.songs)) {
      throw new Error("Invalid response format from OpenAI API")
    }

    return NextResponse.json(result.songs)
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    )
  }
}
