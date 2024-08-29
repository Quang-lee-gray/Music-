/*TODO
1.Render songs
2.Scroll top
3.Play / Pause / Seek
4.CD rotate
5.Next / Prev
6.Random 
7.Next / Repeat when ended
8.Active song
9.Scroll active song into view
10.Play song when click 
*/

/*Gán biến dolla làm cho ngắn gọn*/
var $ = document.querySelector.bind(document); //Gán biến $ làm querySelector
var $$ = document.querySelectorAll.bind(document); //Gán biến $ làm querySelectorAll
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const iRandomBtn = $('.btn-random i');
const repeatBtn = $('.btn-repeat');
const iRepeatBtn = $('.btn-repeat i');
const playlist = $('.playlist');
const rotateAudio = $('.option');
/*Render songs*/

const app = { 
    currentIndex : 0,
    isPlaying : false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Nevada',
            singer: 'Vicetone',
            path: './music/Vicetone-Nevada-Remix.mp3',
            image: 'https://i1.sndcdn.com/artworks-uhxJvgzwC9pZXSlq-7s2ZWQ-t500x500.jpg'
        },
        {
            name: 'SummerTime',
            singer: 'K-391',
            path: './music/Summertime - K-391.mp3',
            image: 'https://i1.sndcdn.com/artworks-000207793601-webozb-t500x500.jpg'
        },
        {
            name: 'Monody',
            singer: 'TheFatRat',
            path: './music/Monody - TheFatRat, Laura Brehm.mp3',
            image : 'https://i1.sndcdn.com/artworks-000240654859-mxpxkl-t500x500.jpg'
        },
        {
            name: 'On My Way',
            singer: 'Alan Walker',
            path: './music/On My Way - Alan Walker Sabrina Carpenter Farruko.mp3',
            image: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Reality_-_Lost_Frequencies_-_single_cover.jpg'
        },
        {
            name: 'Alone',
            singer: 'Alan Walker',
            path: './music/nhacchuong.net_alone.mp3',
            image: 'https://static.wikia.nocookie.net/alan-walker/images/1/1d/9fa13acf7fd692b9310adda64cd0be3f.jpg'
        }
    ],

    //Xử lí sự kiện
    handleEvent: function(){
        //Xử lí quay CD
        const cdThumbAnimate = cdThumb.animate([
            {transform : 'rotate(360deg)'}
        ],
        {
            duration: 10000,
            iterations: Infinity //Xoay liên tục
        })
        cdThumbAnimate.pause();

        //Xử lí quay audio khi phát nhạc bài hát đó
        const audioRotate = function(){
            if(audio.play){
                rotateAudio.classList.add(' fa-spin fa-spin-reverse');
            }else{
                rotateAudio.classList.remove(' fa-spin fa-spin-reverse');
            }
        }
        //Xử lí phóng to, thu nhỏ CD
        const cd = $(".cd");
        const _this = this;
        const cdWidth = cd.offsetWidth;
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 ;
            cd.style.opacity = newCdWidth /  cdWidth;
        }
    
        //Xử lí click vào play
        playBtn.onclick = function(){
           if(_this.isPlaying){
            _this.isPlaying = false;
            audio.pause();
            player.classList.remove('playing');
            cdThumbAnimate.pause();

           }else{
            _this.isPlaying = true;
            audio.play();
            player.classList.add('playing');
            cdThumbAnimate.play();
           }
        }
        //Xử lí tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercen = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercen;
            }
        }

        //Xử lí tua bài hát
        progress.oninput = function(e){
            const seekTime = audio.duration * (e.target.value / 100);
            audio.currentTime = seekTime;
        }

        //Xử lí khi chuyển tiếp bài hát
        nextBtn.onclick = function(){
            if(_this.isRandom === true){
                _this.playRandomSong();
            }else{
                _this.nextSongs();
            }
            audio.play();
            cdThumbAnimate.play();
            player.classList.add('playing');
            _this.render();
            _this.scrollTopActiveSong();
        }
        prevBtn.onclick = function(){
            if(_this.isRandom === true){
                _this.playRandomSong();
            }else{
                _this.prevSongs();
            }
            audio.play();
            cdThumbAnimate.play();
            player.classList.add('playing');
            _this.render();
            _this.scrollTopActiveSong();
        }
        
        //Random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            iRandomBtn.classList.toggle('random',_this.isRandom);
        }

        //Xử lí tự chuyển tiếp khi hết bài hát
        audio.onended = function(){ //onended là phương thức cho chúng ta làm 1 sự kiện gì đó sau khi kết thúc 1 audio
            if(_this.isRepeat === true){
                audio.play();
            }else{
                nextBtn.click();         //Tự động click vào nút next khi hết bài hát
            }
            _this.render();
        }

        //Xử lí nghe lại bài hát cũ khi hết bài hát đó
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            iRepeatBtn.classList.toggle("repeat",_this.isRepeat);
        }

        //Xử lí phát nhạc khi click vào bài hát đó
        playlist.onclick = function(e){
            if(e.target.closest('.song:not(.active)') || e.target.closest('.option')){
                if(e.target.closest('.song:not(.active)')){
                    _this.currentIndex = Number(e.target.closest('.song:not(.active)').dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    cdThumbAnimate.play();
                    player.classList.add('playing');
                    _this.render();
                    _this.scrollTopActiveSong();

                }
            }
        }
    },
    //Lấy ra bài hát từ vị trí hiện tại của bài hát trong mảng (currentIndex)
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    //Lấy ra bài hát từ vị trí hiện tại của bài hát trong mảng (currentIndex)
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    //Active bài hát khi đang chạy
    scrollTopActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        },250);
    },
    //Chuyển tiếp bài hát
    nextSongs: function(){
        this.currentIndex ++;
        //Khi mà đến bài hát cuối cùng thì tự động quay về bài hát ban đầu
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        } 
        this.loadCurrentSong();
    },
    prevSongs: function(){
        this.currentIndex --;
        if(this.currentIndex === -1){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },
    //Random
    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(this.currentIndex === newIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    render: function(){
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image:url('${song.image}')"></div>
                <div class="body">
                    <h3>${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-compact-disc  ${index === this.currentIndex ? 'fa-spin' : ''} "></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    start: function(){
        this.defineProperties();
        this.render();
        this.handleEvent();
        this.loadCurrentSong();
    }
}
app.start();


