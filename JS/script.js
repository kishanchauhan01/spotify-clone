
let currentSong = new Audio
let songs;
let currFolder;

function secondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return `00:00`
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const formateMinutes = String(minutes).padStart(2, '0')
    const formateSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formateMinutes}:${formateSeconds}`

}


async function getSongs() {
    // currFolder = folder    
    let a = await fetch(`/songs/`)
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []

    for (let i = 0; i < as.length; i++) {
        const element = as[i]
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/songs/`)[1])
        }
    }

    console.log(songs)
    

}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/songs/` + track
    currentSong.setAttribute("id", `${currentSong.getAttribute('src').split('songs/')[1].split(".")[0].replaceAll(" ", "%20")}`)
    if (!pause) {
        currentSong.play()
        play.src = "svg/pause.svg"
    }
    let temp = track
    temp = temp.replaceAll("%20", " ").split('.')[0]
    document.querySelector(".songtxt").innerHTML = temp
    document.querySelector(".songtime").innerHTML = '00:00/00:00'
}

async function main() {


    //get the list of all the list
    await getSongs("songs/ncs")//return arr
    playMusic(songs[0], true)


    //show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""


    for (const song of songs) {
        console.log(song)

        songUL.innerHTML = songUL.innerHTML + `
                            <li id="${song.replaceAll("%20", " ").split(".")[0]}">
                                <img class="invert" src="svg/music-svgrepo-com.svg" alt="">
                                <div class="info">
                                    <div>${song.replaceAll("%20", " ").split(".")[0]}</div><br>
                                    <div>kishan</div>
                                </div>
                                <div class="playnow">
                                    <!-- <span>Play Now</span> -->
                                    <img class="play-btn invert" src="svg/play-svgrepo-com.svg" alt="">
                                </div>
                            </li>
        `;
    }

    //Attach an event listner to each song

    Array.from(document.querySelector('.songlist').getElementsByTagName("li")).forEach((e) => {
        // console.log(e.querySelector(".info").firstElementChild.innerHTML)

        e.querySelector(".play-btn").addEventListener("click", (element) => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim() + '.mp3')

            // let audioId = currentSong.getAttribute("id").replaceAll("%20", " ")

            //set bg-color on currentSong 
            // document.getElementById(audioId).style.backgroundColor = "#262626"            

        })
    })



    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "svg/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "svg/play-svgrepo-com.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutes(currentSong.currentTime)}/${secondsToMinutes(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%'
    })

    //add an event listner to seekbar

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    //add an event listner to hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"

    })

    document.querySelector(".hamburger-close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    //add an event listner to previous and next

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }


    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

        else if ((index + 1) >= songs.length) {
            playMusic(songs[0])
        }
    })

    //add event listner to volume seekbar

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e, e.target, e.target.value)
        let volLevel = parseInt(e.target.value)
        currentSong.volume = volLevel / 100

        if (volLevel == 0) {
            document.getElementById("volume-updown").src = "svg/volume-off.svg"
        }
        else {
            document.getElementById("volume-updown").src = "svg/volume.svg"
        }
    })

    //Load the playlist whenever card is clicked

    // Array.from(document.getElementsByClassName("card")).forEach( (e) => {
    //     console.log(e)
    //     e.addEventListener("click", async (item) => {
    //         console.log(item, item.currentTarget.dataset.folder)
    //         songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    //     })
    // })


}

main()