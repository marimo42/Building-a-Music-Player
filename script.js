const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

const allSongs = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
  },
];

const audio = new Audio();
let userData = {
  songs: [...allSongs],     //... is spread, like littery just copying the array and its elements
  currentSong: null,
  songCurrentTime: 0,
};

//third function made
const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;       //This tells the audio element where to find the audio data for the selected song.
  audio.title = song.title;   //This tells the audio element what to display as the title of the song.


  //Before playing the song, you need to make sure it starts from the beginning
  //This condition will check if no current song is playing or if the current song is different from the one that is about to be played.
  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;    //handle the song's current playback time.
  }                                                   //allows you to resume the current song at the point where it was paused
  userData.currentSong = song;
  playButton.classList.add("playing");

  highlightCurrentSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
  audio.play();     //play() is a method from the web audio API for playing an mp3 file.
};

//fifth part
const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime;   //To store the current time of the song when it is paused
  playButton.classList.remove("playing");
  audio.pause();                                  //pause() is a method of the Web Audio API for pausing music files.
};

//seventh part 1
const playNextSong = () => {
  if (userData?.currentSong === null) {   //This will check if there's no current song playing in the userData object.
    playSong(userData?.songs[0].id);
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];   //to retrieve the next song in the playlist

    playSong(nextSong.id);
  }
};


//seventh part 2
const playPreviousSong = () =>{
   if (userData?.currentSong === null) return;    //This will check if there is currently no song playing. If there isn't any, exit the function
   else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id);
   }
};

//11th part - responsible for shuffling the songs in the playlist and performing necessary state management updates after the shuffling.
//for random/shuffled songs - use .sort(()=>Math.random()-0.5)
const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5);
  userData.currentSong = null;
  userData.songCurrentTime = 0;

  // re-render the songs, pause the currently playing song, set the player display, and set the play button accessible text again.
  renderSongs(userData?.songs);
  pauseSong();
  setPlayerDisplay();
  setPlayButtonAccessibleText();
};

//12th part - manage the removal of a song from the playlist & and create a Reset Playlist button when empty
const deleteSong = (id) => {
  //Before deleting a song, you need to check if the song is currently playing.
  //If it is, you need to pause the song and play the next song in the playlist.
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    pauseSong();
    setPlayerDisplay();
  }

  userData.songs = userData?.songs.filter((song) => song.id !== id);
  renderSongs(userData?.songs); 
  highlightCurrentSong(); 
  setPlayButtonAccessibleText(); 

  if (userData?.songs.length === 0) {
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];

      renderSongs(sortSongs()); 
      setPlayButtonAccessibleText();
      resetButton.remove();
    });

  }

};

//ninth part - to display the current song title and artist in the player display
const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  //textContent sets the text of a node and allows you to set or retrieve the text content of an HTML element.
  playingSong.textContent = currentTitle ? currentTitle : "";   
  songArtist.textContent = currentArtist ? currentArtist : "";
};

//eighth part -  function to highlight any song that is being played
const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(
    `song-${userData?.currentSong?.id}`
  );

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");   //this will remove the attribute for each of the songs.
  });

  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");    //to add the attribute back to the currently playing song.
};

//first function made
const renderSongs = (array) => {
  const songsHTML = array
    .map((song)=> {   //To play the song anytime the user clicks on it, add an onclick attribute to the first button element. 
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">    
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join(""); //since songs is an Array, output will be separated by comma which is not desired hence join is used

  playlistSongs.innerHTML = songsHTML;
};

//tenth part - To make the application more accessible, it is important that the play button
//describes the current song or the first song in the playlist.
const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];   //to get the currently playing song or the first song in the playlist

  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

//sixth part (step 50)
//To get the index for the current song, you can use the indexOf() method.
//The indexOf() array method returns the first index at which a given element can be found in the array,
//or -1 if the element is not present.
const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

//fourth part
playButton.addEventListener("click", () => {
    if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id);            //This will ensure the first song in the playlist is played first.
  } else {
    playSong(userData?.currentSong.id);         //This ensures that the currently playing song will continue to play when the play button is clicked.
  }
});

pauseButton.addEventListener("click",  pauseSong);

nextButton.addEventListener("click", playNextSong);

previousButton.addEventListener("click", playPreviousSong);

shuffleButton.addEventListener("click", shuffle);

//13th part - to make next song automatically play when the song finishes
audio.addEventListener("ended", () => {   // an event listener which will detect when the currently playing song ends, fired when the playback of a media reaches the end. 
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

    if (nextSongExists) {
      playNextSong();
    } else {
      userData.currentSong = null;
      userData.songCurrentTime = 0;  
pauseSong();
setPlayerDisplay();
highlightCurrentSong();
setPlayButtonAccessibleText();
    }
});

//second function made
//this is to arrange songs alphabettically
const sortSongs = () => {
  userData?.songs.sort((a,b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};

renderSongs(sortSongs()); //to display songs
setPlayButtonAccessibleText();
