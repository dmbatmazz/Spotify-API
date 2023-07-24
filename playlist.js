// const express = require("express");
// const axios = require("axios");
// const sqlite3 = require("sqlite3").verbose();
// const mongoose = require('mongoose');

// const app = express();
// const port = 8080;

// const db = new sqlite3.Database("database.db");

// const uri = "mongodb+srv://Melis:Melis123.!@cluster0.9jeu53d.mongodb.net/?retryWrites=true&w=majority";


// mongoose.set('debug', true);
// mongoose.connect(uri);

// mongoose.connection.on("error", (err) => {
//   console.error("MongoDB connection error:");
// });

// const userSchema = new mongoose.Schema({
//   name: String,
//   username: String,
//   playlistName: String,
// });

// const User = mongoose.model("User", userSchema);

// async function saveUserAndMusic() {
//   // Save user and playlist data to MongoDB
//   const user = new User({
//     name: "melis batmaz",
//     username: "melis_batmaz",
//     playlistName: "favorite songs",
//   });
//   await user.save();

//   const musicSchema = new mongoose.Schema({
//     playlistName: String,
//     songName: String,
//     artist: String,
//   });

//   const Music = mongoose.model("Music", musicSchema);

//   // Save music and playlist data to MongoDB
//   const music = new Music({
//     playlistName: "favorite songs",
//     songName: "The Feeling",
//     artist: "Massano",
//   });
//   await music.save();
// }

// // MongoDB bağlantısı tamamlandıktan sonra işlemleri gerçekleştirmek için
// mongoose.connection.once('open', async () => {
//   try {
//     // saveUserAndMusic fonksiyonunu çağırıyoruz
//     await saveUserAndMusic();

//     // MongoDB bağlantısı başarıyla yapıldıktan sonra sunucu dinlemeye başlıyo
//     app.listen(port, () => {
//       console.log(`Server is running on http://localhost:${port}`);
//     });
//   } catch (error) {
//     console.error("An error occurred:", error.message);
//     process.exit(1); 
//   }
// });

// // Spotify API
// const spotifyAPI = axios.create({
//   baseURL: "https://api.spotify.com/v1",
//   headers: {
//     Authorization: "BQCVwx236Fn6GKZFWrtwlockLOpU9KOadaBCPapozYAMYiref7oMGtxChDInYRDgkVUnnVJDp0tKjhWMf3HsXAIAlsfDPgesr-Z_z9Z7YKJ1KR-4hP8",
//     "Content-Type": "application/json",
//   },
// });

// // Function to create a user and their playlist on Spotify
// async function createUserAndPlaylist(name, playlistName, song) {
//   try {
//     return user;
//   } catch (error) {
//     console.error("Error creating user and playlist:", error.response.data);
//     throw error;
//   }
// }

// // create user and save playlist
// app.post("/users", async (req, res) => {
//   const { name, playlistName, song } = req.body;

//   try {
//     // Create user and playlist on Spotify and save data to MongoDB
//     const user = await createUserAndPlaylist(name, playlistName, song);

//     res.status(201).json(user);
//   } catch (error) {
//     console.error("An error occurred:", error.message);
//     res
//       .status(500)
//       .send("An error occurred. Please check the console for details.");
//   }
// });

// // get all users
// app.get("/users", (req, res) => {
//   db.all("SELECT * FROM users", (err, rows) => {
//     if (err) {
//       console.error("Error retrieving users:", err.message);
//       res
//         .status(500)
//         .send("An error occurred. Please check the console for details.");
//       return;
//     }

//     res.json(rows);
//   });
// });
