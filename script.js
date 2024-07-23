let songs;
let newfolder ;

async function getsongs(folder) {
    newfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let info = await a.text()
    let div = document.createElement('div')
    div.innerHTML = info
    let as = div.getElementsByTagName('a');
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector('.songlist').getElementsByTagName('ul')[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li >${song.replaceAll('%20', ' ').replace('05-', ' ').replace('YOYOHONEYSINGH', ' ').replace('GIPPYGREWAL', ' ')}</li>`;
    }


    Array.from(document.querySelector(".songlist").getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', () => {
            console.log(e.innerHTML)
            playmusic(e.innerHTML.trim())

        })
    })

}

function convertSecondsToMinutesSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

let currentsong = new Audio()
const playmusic = (track) => {
    currentsong.src = `/${newfolder}/` + track
    currentsong.play()
    document.querySelector(".play-pause").firstElementChild.src = "pause.svg"
    document.querySelector(".songinfo").innerHTML = (track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
    document.querySelector(".left").style = "-100%"
    document.querySelector(".volume").style.visibility = "visible"
}

async function main() {
    await getsongs("songs/main")

    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            document.querySelector(".play-pause").firstElementChild.src = "pause.svg"
        }
        else{
            currentsong.pause()
            document.querySelector(".play-pause").firstElementChild.src = "play.svg"
        }
    })

    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesSeconds(currentsong.currentTime)}/${convertSecondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + "%";

        currentsong.currentTime = currentsong.duration * (e.offsetX/e.target.getBoundingClientRect().width)*100/100
    })

    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left ="0";
    })

    document.querySelector(".cross").addEventListener("click",()=>{
        document.querySelector(".left").style.left ="-100%";
    })

    previous.addEventListener("click",()=>{
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
            playmusic(songs[index-1].replaceAll('%20',' '))
        }
        else{
            currentsong.play()
        }
    })
    next.addEventListener("click",()=>{
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){
            playmusic(songs[index+1].replaceAll('%20',' '))
        }
        else{
            currentsong.play();
        }
    })
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsong.volume = parseInt(e.target.value)/100
    })

    Array.from(document.getElementsByClassName("cards")).forEach(e=>{
        e.addEventListener("click",async item =>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`) 
        })
    })
    
}

main()