"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"

async function fetchTrackDetails(song, artist) {
  const query = `${song} ${artist}`
  const response = await fetch(
    `/utils/spotify-search?q=${encodeURIComponent(query)}`
  )
  if (!response.ok) {
    throw new Error("Failed to fetch track details")
  }
  return response.json()
}

function AlbumArtWork({ artist, song }) {
  const [trackDetails, setTrackDetails] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getTrackDetails = async () => {
      try {
        const data = await fetchTrackDetails(song, artist)
        setTrackDetails(data)
      } catch (err) {
        setError(err.message)
      }
    }

    if (song && artist) {
      getTrackDetails()
    }
  }, [song, artist])

  if (error) return <div>Error: {error}</div>
  if (!trackDetails) return <div>Loading...</div>

  const album =
    trackDetails.albums && trackDetails.albums.items
      ? trackDetails.albums.items[0]
      : null

  return (
    <div>
      {album && album.images.length > 0 ? (
        <Image
          src={album.images[0].url}
          alt={album.name}
          width={album.images[0].width}
          height={album.images[0].height}
        />
      ) : (
        <div>No album art found</div>
      )}
    </div>
  )
}

export default AlbumArtWork
