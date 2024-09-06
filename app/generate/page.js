"use client"
import React, { useState, useEffect } from "react"
import { useUser, UserButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Music, PlayCircle, X } from "lucide-react"

function AlbumArtWork({ artist, song }) {
  const [artworkUrl, setArtworkUrl] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    async function fetchArtwork() {
      if (!artist || !song) {
        setStatus('not found');
        return;
      }
      setStatus('loading');
      try {
        const response = await fetch(`/api/getAlbumArtwork?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.url) {
          setArtworkUrl(data.url);
          setStatus('loaded');
        } else {
          setStatus('not found');
        }
      } catch (error) {
        console.error('Error fetching artwork:', error);
        setStatus('error');
      }
    }

    fetchArtwork();
  }, [artist, song]);

  if (status === 'loading') return <p>Loading artwork...</p>;
  if (status === 'error') return <p>Error loading artwork</p>;
  if (status === 'not found') return <p>No artwork found</p>;
  return <img src={artworkUrl} alt="Album Artwork" className="w-full h-full object-cover" />;
}


export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("song")
  const [songs, setSongs] = useState(["", "", "", "", ""])
  const [artists, setArtists] = useState(["", "", "", "", ""])
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    // Load history from localStorage
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem("recommendationHistory")
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory))
      }
    }
  }, [])

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  const handleSongChange = (index, value) => {
    const newSongs = [...songs]
    newSongs[index] = value
    setSongs(newSongs)
  }

  const handleArtistChange = (index, value) => {
    const newArtists = [...artists]
    newArtists[index] = value
    setArtists(newArtists)
  }

  const generateRecommendation = async () => {
    if (
      !songs.some((song) => song.trim() !== "") &&
      !artists.some((artist) => artist.trim() !== "")
    ) {
      alert("Please enter at least one song or artist")
      return
    }

    setIsLoading(true)
    setResult(null)

    const payload = {
      songs: songs.filter((song) => song.trim() !== ""),
      artists: artists.filter((artist) => artist.trim() !== ""),
      type: activeTab,
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setResult(data)

      // Add to history
      const newHistory = [
        { type: activeTab, result: data },
        ...history.slice(0, 4),
      ]
      setHistory(newHistory)
      if (typeof window !== 'undefined') {
        localStorage.setItem("recommendationHistory", JSON.stringify(newHistory))
      }
    } catch (error) {
      console.error("Error:", error)
      setResult({
        error: "An error occurred while generating recommendations.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const clearInputs = () => {
    setSongs(["", "", "", "", ""])
    setArtists(["", "", "", "", ""])
  }

  // If still loading auth state, show a loading message
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold text-xl">
            Music Bot
          </Link>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user?.firstName || 'User'}!</span>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-10 p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Generate Music Recommendations
        </h1>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${
              activeTab === "song" ? "bg-purple-500" : "bg-purple-700"
            } rounded-tl-lg rounded-bl-lg`}
            onClick={() => setActiveTab("song")}
          >
            Song Recommendation
          </button>
          <button
            className={`flex-1 py-2 ${
              activeTab === "playlist" ? "bg-purple-500" : "bg-purple-700"
            } rounded-tr-lg rounded-br-lg`}
            onClick={() => setActiveTab("playlist")}
          >
            Playlist Generation
          </button>
        </div>

        {/* Input Form */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Top 5 Songs</h2>
          {songs.map((song, index) => (
            <input
              key={`song-${index}`}
              type="text"
              value={song}
              onChange={(e) => handleSongChange(index, e.target.value)}
              placeholder={`Song ${index + 1}`}
              className="w-full p-2 mb-2 bg-white/20 rounded text-white placeholder-gray-300"
            />
          ))}

          <h2 className="text-xl font-semibold mb-4 mt-6">
            Your Top 5 Artists
          </h2>
          {artists.map((artist, index) => (
            <input
              key={`artist-${index}`}
              type="text"
              value={artist}
              onChange={(e) => handleArtistChange(index, e.target.value)}
              placeholder={`Artist ${index + 1}`}
              className="w-full p-2 mb-2 bg-white/20 rounded text-white placeholder-gray-300"
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mb-8">
          <button
            onClick={clearInputs}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <X className="mr-2" /> Clear Inputs
          </button>
          <button
            onClick={generateRecommendation}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <PlayCircle className="mr-2" /> Generate{" "}
                {activeTab === "song" ? "Song" : "Playlist"}
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white/20 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Recommendations:</h2>
            {result.error ? (
              <p className="text-red-400">{result.error}</p>
            ) : (
              <ul className="space-y-4">
                {result.map((item, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <AlbumArtWork artist={item.artist} song={item.name} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <Music className="mr-2" />
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <div className="italic ml-6">by {item.artist}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {/* History */}
        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recent Recommendations</h2>
            {history.map((item, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">
                  {item.type === "song" ? "Song Recommendation" : "Playlist"}
                </h3>
                <ul className="list-disc list-inside">
                  {item.result.slice(0, 3).map((song, songIndex) => (
                    <li key={songIndex}>
                      {song.name} by {song.artist}
                    </li>
                  ))}
                  {item.result.length > 3 && <li>...</li>}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
