const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const mongoose = require('mongoose');
const path = require("path");
const app = express();
const port = 9090;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const clientId = 'deb4ed7d2aa24afbb0f1da4c5b8119bc'; 
const clientSecret = '3c6c0e4459d040d2ace1bdb0b8294463'; 
const redirectUri = 'http://localhost:9090/callback'; 
const accessToken = 'BQDfeptYyo3SoUfKbqBtRsJvQRnxgYlJinWruOXghjeSUz8tQ1VnBWhAKCcy7MS3QOz0AVi11KWhzV9I5OKUNNjCF2BK9Y88NdEU1IX0m0OeDQgdi8o'; 

// MongoDB bağlantısı
const uri = "mongodb+srv://Melis:Melis123.!@cluster0.9jeu53d.mongodb.net/?retryWrites=true&w=majority"; 

mongoose.set('debug', true);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  playlistName: String,
});

const User = mongoose.model("User", userSchema);

// Spotify Web API ayarları
const spotifyAPI = axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
});

app.get('/login', (req, res) => {
  const scope = 'playlist-modify-private'; // Playlist değiştirme izni artık herkes şarkı ekleyebilir
  res.redirect(`https://accounts.spotify.com/authorize?${querystring.stringify({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
  })}`);
});

app.get('/callback', (req, res) => {
  const code = req.query.code || null;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  axios.post(authOptions.url, authOptions.data, { headers: authOptions.headers })
    .then(response => {
      const accessToken = response.data.access_token;

      // Şarkı arama işlemi:
      const searchQuery = 'YOUR_SEARCH_QUERY'; // Kullanıcının aramak istediği şarkı ya da sanatçı adı
      const searchOptions = {
        url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`,
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      };

      axios.get(searchOptions.url, { headers: searchOptions.headers })
        .then(response => {
          const trackUri = response.data.tracks.items[0].uri; // İlk seçilen şarkının URIsı

          // "favorite songs" playlistine şarkı eklemek için:
          const playlistId = '2yIwpw07FQRJgE9gTVX3zx'; // "favorite songs" playlistinin ID'si.
          const addTrackOptions = {
            url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            headers: {
              'Authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json',
            },
            data: JSON.stringify({ uris: [trackUri] }),
          };

          axios.post(addTrackOptions.url, addTrackOptions.data, { headers: addTrackOptions.headers })
            .then(() => {
              console.log('Track added to playlist!');
            })
            .catch(error => {
              console.error('Error adding track to playlist:', error.response.status, error.response.data);
            });
        })
        .catch(error => {
          console.error('Error searching for track:', error.response.status, error.response.data);
        });
    })
    .catch(error => {
      console.error('Error exchanging code for access token:', error.response.status, error.response.data);
    });
});

const searchSongs = () => {
  const searchQuery = document.getElementById('searchQuery').value;
  
  const searchOptions = {
    url: `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`,
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
  };

  // API'den şarkıları arama
  fetch(searchOptions.url, {
    headers: searchOptions.headers,
  })
    .then((response) => response.json())
    .then((data) => {
      // Şarkılar listesini alıp sayfada gösterme
      displaySongs(data.tracks.items);
    })
    .catch((error) => console.error('Error searching for track:', error));
};

const displaySongs = (songs) => {
  const searchResultsDiv = document.getElementById('searchResults');
  searchResultsDiv.innerHTML = ''; // Önceki sonuçları temizle

  songs.forEach((song) => {
    const songName = song.name;
    const artistName = song.artists.map((artist) => artist.name).join(', ');
    const albumName = song.album.name;

    // Şarkıları listeleyerek kullanıcının seçmesini
    const songElement = document.createElement('div');
    songElement.innerHTML = `<p>${songName} - ${artistName} (${albumName})</p>`;
    songElement.addEventListener('click', () => addToFavoritePlaylist(song.uri)); // Şarkıya tıklandığında listeye ekleme
    searchResultsDiv.appendChild(songElement);
  });
};

const addToFavoritePlaylist = (trackUri) => {
  const addTrackOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [trackUri] }),
  };

  // Şarkıyı "favorite songs" playlistine eklemek için isteği gönder
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, addTrackOptions)
    .then((response) => {
      if (response.status === 201) {
        console.log('Track added to playlist!');
      } else {
        console.error('Error adding track to playlist:', response.status);
      }
    })
    .catch((error) => console.error('Error adding track to playlist:', error));
};


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get('/app.js', (req, res) => {
  res.sendFile(path.join(__dirname, "app.js"));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
