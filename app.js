const express = require('express');
const axios = require('axios');
const querystring = require('querystring');
const path = require("path");
var app = express();
const port = 9090;
var cors = require('cors');
var cookieParser = require('cookie-parser');


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const clientId = 'deb4ed7d2aa24afbb0f1da4c5b8119bc'; 
const clientSecret = '3c6c0e4459d040d2ace1bdb0b8294463'; 
const redirectUri = 'http://localhost:9090/callback'; 
const accessToken = 'BQDCasrH00b_NN_ke4GEks-Ac2-AcE08_u7lX0UDAKvlPP6eMSfY3Qur28XUDm2eT_A5NfLDtpzy0Bsk2e937k-cwb1Izew0u0Zs3wZ9GTWPZrvE3DAa0ERRUZCcCoFHBZY8NPlQckps-UXBY08172peICvqHe9lbPGcdsOTor_7r7GbfWeSlTkFmAi-Nm1CoUxIGVeKCviSyhaznXZUk09JoGouhGfTdR0QF_HRQI_kreYA0YjUI7ULdnO8YiF9hyA';

//yeni kod
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());


//eski kodlar
// Spotify Web API ayarları
const spotifyAPI = axios.create({
  baseURL: "https://api.spotify.com/v1",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
});

// app.get('/login', function(req, res) {

//   var state = generateRandomString(16);
//   var scope = 'user-read-private user-read-email';

//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state
//     }));
// });

//yukardaki yerine bu:
app.get('/login', function(req, res) {
  console.log("Melis")

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'playlist-modify-public playlist-modify-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      redirect_uri: redirectUri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  console.log("Meliss Callback")

  var code = req.query.code || null;
  var state = req.query.state || null;

  console.log(code);
  console.log(state)

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    console.log("Melis Else")
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')),
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      json: true
    };
  }
//yeni kod
  app.get('/refresh_token', function(req, res) {

    var refresh_token = req.query.refresh_token;
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')) },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };
  
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token;
        res.send({
          'access_token': access_token
        });
      }
    });
  });
  


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
          const trackUri = response.data.tracks.items[0].uri; 

          // "favorite songs" playlistine şarkı eklemek için:
          const playlistId = '3HyLpgCvdI5TLDMXLrrvrP'; // "favorite songs" playlistinin ID'si.
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

    // Add butonunu oluştur
    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.classList.add('add-button');
    addButton.addEventListener('click', () => addToFavoritePlaylist(song.uri, songName, artistName));

    // Şarkıyı ekrana ekle
    songElement.appendChild(addButton);
    searchResultsDiv.appendChild(songElement);
  });
};

const addToFavoritePlaylist = (trackUri, songName, artistName) => {
  const playlistId = '3HyLpgCvdI5TLDMXLrrvrP'; // "favorite songs" playlistinin ID'si.

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
      console.log(`${songName} by ${artistName} added to playlist!`);
    })
    .catch(error => {
      console.error('Error adding track to playlist:', error.response.status, error.response.data);
    });
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
