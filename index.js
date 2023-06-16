const { Player, Ease } = TextAliveApp;

//TextAlive Playerの初期化(右下のやつ)
const player = new Player({
    app: { token: "m94vk5voEisP2leB", },
    mediaElement: document.querySelector("#media"),
    mediaBannerPosition: "bottom right"
});

player.addListener({
    onAppReady,
    onTimerReady,
    onThrottledTimeUpdate,
    onAppMediaChange,
});

const playBtn = document.querySelector("#play");
const jumpBtn = document.querySelector("#jump");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");
const positionEl = document.querySelector("#position strong");

const artistSpan = document.querySelector("#artist span");
const songSpan = document.querySelector("#song span");
const phraseEl = document.querySelector("#container p");

// Runボタンが押されたときによばれる
let songName;
function songSelect() {
    songName = document.getElementById("songURL").value;
    player.createFromSongUrl(songName);
    document.getElementById("songURL").value = "";
}

// APIの準備ができ次第呼び出される(ボタンの設定など)
function onAppReady(app) {
    if (!app.managed) {
        document.querySelector("#control").style.display = "block";
        playBtn.addEventListener(
            "click",
            () => player.video && player.requestPlay()
        );
        jumpBtn.addEventListener(
            "click",
            () =>
                player.video &&
                player.requestMediaSeek(player.video.firstPhrase.startTime)
        );
        pauseBtn.addEventListener(
            "click",
            () => player.video && player.requestPause()
        );
        rewindBtn.addEventListener(
            "click",
            () => player.video && player.requestMediaSeek(0)
        );

    }
    // if (!app.songUrl) {
    //     //player.createFromSongUrl("https://www.youtube.com/watch?v=ygY2qObZv24");
    // }
}

// 再生コントロールがでいるようになったら呼び出される
function onTimerReady() {
    artistSpan.textContent = player.data.song.artist.name;
    songSpan.textContent = player.data.song.name;

    document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));

    let p = player.video.firstPhrase;
    jumpBtn.disabled = !p;

    while (p && p.next) {
        p.animate = animatePhrase;
        p = p.next;
    }
}

function onThrottledTimeUpdate(position) {
    positionEl.textContent = String(Math.floor(position));
}

function animatePhrase(now, unit) {
    if (unit.contains(now)) {
        phraseEl.textContent = unit.text;
    }
}

//曲が変わった時に呼ばれる
function onAppMediaChange() {
    overlay.className = "";
    bar.className = "";
    phraseEl.textContent = "";
}