const express = require("express");
const axios = require("axios");
const mongoose = require('mongoose');
const path = require("path");

const app = express();
const port = 8088;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Spotify API anahtarları
const clientId = "deb4ed7d2aa24afbb0f1da4c5b8119bc";
const clientSecret = "3c6c0e4459d040d2ace1bdb0b8294463";

//access token
const token = "BQAk0YQDgxyNOK-ZrQ_UGDtLIbb7bLcUgvuI7yaDMNnGVqFXGbuL67csYk4-hhpl6Qd2JpZal5IBxQmVU3o0lwvKyzy4TRaYQNcXfaXgw4IwHMyzWlE";

// Spotify Web API ayarları
const spotifyAPI = axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: {
    Authorization: token,
    "Content-Type": "application/json",
  },
});

//PRIVATE METHOD
const _getToken = async () => {
const result = await fetch('https://accounts.spotify.com/api/token',{
  method : 'POST',
  headers: {
    'Content-Type' : 'application/x-www-form-urlencoded',
    'Authorization' : 'Basic ' + btoa( clientId + ':' + clientSecret)
  },
  body: 'grant_type=client_credentials'
}); 
const data = await result.json();
return data.token; 
}

// MongoDB bağlantısı ve kullanıcı modeli
const uri = "mongodb+srv://Melis:Melis123.!@cluster0.9jeu53d.mongodb.net/?retryWrites=true&w=majority";

mongoose.set('debug', true);
mongoose.connect(uri);

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:");
});

// const userSchema = new mongoose.Schema({
//   name: String,
//   username: String,
//   playlistName: String,
// });

// const User = mongoose.model("User", userSchema);

// Mevcut playlist ID'si
const favoritePlaylistId = "https://open.spotify.com/playlist/2yIwpw07FQRJgE9gTVX3zx?si=a9588f5f09384c82";

// Şarkı arama işlemi için endpoint
app.post("/search", async (req, res) => {
  const { songName, artistName } = req.body;

  try {
    // Spotify API'ye şarkı arama isteği gönderme
    const searchResponse = await spotifyAPI.get("/search", {
      params: {
        q: `track:${songName} artist:${artistName}`,
        type: "track",
        limit: 10
      }
    });

    // Sonuçları kullanıcıya gönderme
    res.json(searchResponse.data.tracks.items);
  } catch (error) {
    console.error("An error occurred:", error.message);
    res
      .status(500)
      .send("An error occurred. Please check the console for details.");
  }
});

// Playliste şarkı ekleme işlemi için endpoint
app.post("/add-to-playlist", async (req, res) => {
  const { songId } = req.body;

  try {
    // Spotify API'ye şarkıyı playliste ekleme isteği gönderme
    await spotifyAPI.post(`/playlists/${favoritePlaylistId}/tracks`, {
      uris: [`spotify:track:${songId}`]
    });

    // Başarılı ekleme mesajını kullanıcıya gönderme
    res.json({ message: "Song added to playlist successfully." });
  } catch (error) {
    console.error("An error occurred:", error.message);
    res
      .status(500)
      .send("An error occurred. Please check the console for details.");
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
