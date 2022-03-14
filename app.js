const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "player-music";
const nameSong = $("header h2");
const cdThumb = $(".dashboard__disk--playing");
const audio = $("#audio");
const cd = $(".dashboard__disk");
const playList = $(".play-list");
const btnPlay = $(".btn__toggle-play");
const dashBoard = $(".dashboard");
var isCheck = true;
const range = $("#slider");
var isTimeUpdate = true;
var isTouch = true;
var isRepeat = false;
var isRandom = false;
const btnNext = $(".btn-right");
const btnPre = $(".btn-left");
const btnRepeat = $(".btn-repeat");
const btnRandom = $(".btn-random");
const btnHeart = $(".btn-heart");
const itemSong = $(".play-list__item");
const app = {
  currentIndex: 0,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  songs: [
    {
      name: "Attention",
      singer: "Charlie Puth",
      img: "./assets/img/img1.jpg",
      path: "./assets/music/song1.mp3",
    },
    {
      name: "believe",
      singer: "Imagine Dragons",
      img: "./assets/img/img2.jpg",
      path: "./assets/music/song2.mp3",
    },
    {
      name: "Dark horse",
      singer: "Katy Perry",
      img: "./assets/img/img3.jpg",
      path: "./assets/music/song3.mp3",
    },
    {
      name: "How long",
      singer: "Charlie Puth",
      img: "./assets/img/img4.jpg",
      path: "./assets/music/song4.mp3",
    },
    {
      name: "Soledad",
      singer: " Westlife",
      img: "./assets/img/img5.jpg",
      path: "./assets/music/song5.mp3",
    },
    {
      name: "Sugar",
      singer: "Marron 5",
      img: "./assets/img/img6.jpg",
      path: "./assets/music/song6.mp3",
    },
    {
      name: "That Girl",
      singer: "Olly Murs",
      img: "./assets/img/img7.jpg",
      path: "./assets/music/song7.mp3",
    },
    {
      name: "Sold out",
      singer: "Hawk Nelson",
      img: "./assets/img/img8.jpg",
      path: "./assets/music/song8.mp3",
    },
    {
      name: "See you again",
      singer: "Jason Derulo",
      img: "./assets/img/img9.jpg",
      path: "./assets/music/song9.mp3",
    },
    {
      name: "Less Than Hero",
      singer: "The Weeknd",
      img: "./assets/img/img10.jpg",
      path: "./assets/music/song10.mp3",
    },
  ],
  // start
  start: function () {
    this.defineProperties();
    this.loadCurrentSong();
    this.handler();
    this.render();
  },
  // define Property
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  // load music
  loadCurrentSong: function () {
    audio.src = `${this.currentSong.path}`;
    nameSong.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.img})`;
  },
  songActiveView: function () {
    setTimeout(() => {
      $(".play-list__item.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  // function repeat song
  repeatSong: function () {
    this.loadCurrentSong();
  },
  // function previous song
  previousSong: function () {
    app.currentIndex--;
    if (app.currentIndex < 0) {
      app.currentIndex = app.songs.length - 1;
    }
    app.loadCurrentSong();
    app.songActiveView();
  },
  // function next song
  nextSong: function () {
    app.currentIndex++;
    if (app.currentIndex >= app.songs.length) {
      app.currentIndex = 0;
    }
    app.loadCurrentSong();
    app.songActiveView();
  },
  randomSong: function () {
    let indexRandom = Math.floor(Math.random() * this.songs.length);
    do {
      indexRandom = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === indexRandom);
    this.currentIndex = indexRandom;
    this.loadCurrentSong();
  },

  // handle event
  handler: function () {
    // handle cd when scroll
    cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;
      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };
    // handle cd rotate
    const cdAnimate = cd.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdAnimate.pause();
    // handle when song end
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        app.nextSong();
        app.render();
        audio.play();
      }
    };
    // handle tym song
    btnHeart.onclick = function () {
      btnHeart.classList.toggle("active");
    };
    // handle repeat song
    btnRepeat.onclick = function () {
      app.isRepeat = !app.isRepeat;
      btnRepeat.classList.toggle("active", app.isRepeat);
    };
    // handle previous song
    btnPre.onclick = function () {
      if (isRandom) {
        app.randomSong();
      } else {
        app.previousSong();
      }
      audio.play();
      app.render();
    };
    // handle next song
    btnNext.onclick = function () {
      if (isRandom) {
        app.randomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render();
    };
    // handle random song
    btnRandom.onclick = function () {
      isRandom = !isRandom;
      btnRandom.classList.toggle("active", isRandom);
    };
    // handle play song
    btnPlay.onclick = function () {
      if (isCheck) {
        audio.play();
      } else {
        audio.pause();
      }
    };
    audio.onplay = function () {
      cdAnimate.play();
      dashBoard.classList.add("playing");
      isCheck = false;
    };
    audio.onpause = function () {
      cdAnimate.pause();

      dashBoard.classList.remove("playing");
      isCheck = true;
    };
    // handle song rewind
    audio.ontimeupdate = function () {
      if (isTimeUpdate) {
        const rangePercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        range.value = rangePercent;
      }
    };
    // check app in mobile or not
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      isTouch = "touchstart";
    } else {
      isTouch = "mousedown";
    }
    range.addEventListener(isTouch, function () {
      isTimeUpdate = false;
    });
    range.onchange = function (e) {
      const seekTime = (e.target.value / 100) * audio.duration;
      audio.currentTime = seekTime;
      isTimeUpdate = true;
    };
    playList.onclick = function (e) {
      const songElement = e.target.closest(".play-list__item:not(.active)");
      if (songElement || e.target.closest(".play-list__option")) {
        if (songElement) {
          songElement.classList.add("active");
          app.currentIndex = Number(songElement.getAttribute("data-item"));
          app.loadCurrentSong();
          app.render();
          audio.play();
        }
        if (e.target.closest(".play-list__option")) {
          console.log(1);
        }
      }
    };
  },
  // handle render music
  render: function () {
    const htmls = app.songs.map(function (song, index) {
      return `<div class="play-list__item ${
        index === app.currentIndex ? "active" : ""
      } "data-item = ${index} >
           <div
             class="play-list__img"
             style="background-image: url(${song.img})"
           ></div>
           <div class="play-list__body">
             <h3 class="play-list__name">${song.name}</h3>
             <p class="play-list__singer">${song.singer}</p>
           </div>
           <div class="play-list__option">
             <i class="fa-solid fa-ellipsis"></i>
           </div>
         </div>`;
    });
    playList.innerHTML = htmls.join("");
  },
  chooseSong: function () {
    itemSong.onclick = function () {};
  },
};
// call start app
app.start();
