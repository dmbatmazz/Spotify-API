// const axios = require("axios");
// const express = require("express");
// const bodyParser = require("body-parser");

// const app = express();
// const port = 8888;

// const token = 'BQAachGIXMotQ5GN4iKTWTbsIfJ8VwsVf5ou6a9WXbjewW5sk5FRtWLM-tQwSVh6F__71n3V5pH6hzgU0kwHlhkthWxCAHwarnCkk0OqNL7vb8FEAMM';

// const users = [
//   { id: '111', name: 'User 1', playlistId: null },
//   { id: '222', name: 'User 2', playlistId: null },
// ];

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// //create a playlist 
// async function createPlaylist(userId, playlistName) {
//   try {
//     const createPlaylistResponse = await axios.post(
//       `https://api.spotify.com/v1/users/${userId}/playlists`,
//       {
//         name: playlistName,
//         public: false,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     const playlistId = createPlaylistResponse.data.id;
//     return playlistId;
//   } catch (error) {
//     console.error('Error creating playlist:', error.response.data);
//     throw error;
//   }
// }

// //add tracks to a playlist
// async function addTracksToPlaylist(playlistId, trackUris) {
//   try {
//     await axios.post(
//       `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
//       {
//         uris: trackUris,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     console.log('Tracks added to playlist successfully!');
//   } catch (error) {
//     console.error('Error adding tracks to playlist:', error.response.data);
//     throw error;
//   }
// }

// //cd display the songs from Spotify on a web page
// app.get('/', async (req, res) => {
//   try {
//     const response = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
//       params: {
//         limit: 10,
//       },
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const tracks = response.data.items.map((track) => ({
//       name: track.name,
//       artist: track.artists[0].name,
//       uri: track.uri,
//     }));

//     res.send(`<h1>Spotify Songs</h1>
//       <ul>
//         ${tracks.map((track) => `<li>${track.name} - ${track.artist}</li>`).join('')}
//       </ul>
//       <form action="/add-song" method="post">
//         <input type="text" name="songName" placeholder="Song Name" required />
//         <input type="text" name="artistName" placeholder="Artist Name" required />
//         <button type="submit">Add Song</button>
//       </form>`);
//   } catch (error) {
//     console.error('An error occurred:', error.message);
//     res.send('An error occurred. Please check the console for details.');
//   }
// });

// //add a new song to a user's playlist
// app.post('/add-song', async (req, res) => {
//   const { songName, artistName } = req.body;

//   try {
//     for (const user of users) {
//       const trackUris = [`spotify:track:${user.id}${songName.replace(/\s/g, '')}${artistName.replace(/\s/g, '')}`];

//       if (!user.playlistId) {
//         user.playlistId = await createPlaylist(user.id, `${user.name}'s Playlist`);
//       }

//       await addTracksToPlaylist(user.playlistId, trackUris);
//     }

//     res.redirect('/');
//   } catch (error) {
//     console.error('An error occurred:', error.message);
//     res.send('An error occurred. Please check the console for details.');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
