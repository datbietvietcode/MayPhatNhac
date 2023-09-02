const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE = 'The_Dat'


const heading = $('header h2')
const cdThumd = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')

const playBtn =$('.btn-toggle-play') 
const player = $('.player')

const progress = $('#progress')

const nextBtn =$('.btn-next')
const prevBtn =$('.btn-prev')

const randomBtn = $('.btn-random')


const repeatBtn = $('.btn-repeat')

const playlist= $('.playlist')

const app = {
    isPlaying : false,
    currentIndex: 0,
    isRandom : false,
    isRepeat : false,
    setting : JSON.parse(localStorage.getItem(PLAYER_STORAGE)) || {},
    songs: [
        {
            name : 'Nếu ngày ấy ~',
            singer : 'Gi Gi Hương Giang',
            path : "./music_lyric/neungayay.mp3",
            image : "./img/mpxinh1.jpg"
        },
        {
            name : 'Cần Không Có, Có Không Cần ~',
            singer : 'Thanh Hưng',
            path : "./music_lyric/cankhongcocokhongcan.mp3",
            image : "./img/meow.jpg"
        },
        {
            name : 'Cánh tay ai vừa ôm em sao ~',
            singer : 'Trần Khánh Huyền - cover',
            path : "./music_lyric/canhtayaivuaomemsao.mp3",
            image : "./img/sad1.jpg"
        },
        {
            name : 'Lâu lâu nhắc lại ~',
            singer : 'Hà Nhi ft Khói',
            path : "./music_lyric/laulaunhaclai.mp3",
            image : "./img/sad2.jpg"
        },
        {
            name : 'Anh chẳng thể (Lofi Ver.) ~',
            singer : 'Phạm Kỳ x Orinn',
            path : "./music_lyric/anhchangthe.mp3",
            image : "./img/sad3.jpg"
        },
        {
            name : 'Em xứng đáng bình yên (Lofi Ver.) ~',
            singer : 'Xuân Đức x Karrot',
            path : "./music_lyric/emxungdangbinhyen.mp3",
            image : "./img/sad4.jpg"
        },
        {
            name : 'W/n - id 072019',
            singer : '3107 ft 267',
            path : "./music_lyric/id072019.mp3",
            image : "./img/sad5.jpg"
        },
       
        // {
        //     name : 'Nếu ngày ấy',
        //     singer : 'Gi Gi Hương Giang',
        //     path : "./music_lyric/neungayay.mp3",
        //     image : "./img/mpxinh1.jpg"
        // },
    ],
    render: function (){
        const htmls = this.songs.map((song,index) => {
            return `<div  class="song ${index === this.currentIndex ? 'active'   : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}');">  
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="far fa-ellipsis-h"></i>
                    </div>
                </div>`
        })
       playlist.innerHTML = htmls.join('')

    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong",{
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    HandleEvent: function (){
        
        const cdWidth = cd.offsetWidth
        const _this = this;

  // 4. CD rorate
  const cdThumAnimate = cdThumd.animate(
    [
        {
            transform: "rotate(360deg)",
        },
    ],
    {
        duration: 10000,        // time quay img
        iterations: Infinity,
    }
);
cdThumAnimate.pause();



        // xử lý phóng to thu nhỏ CD
        document.onscroll = function(){
        const scrollTop = window.scrollY   || document.documentElement.scrollTop;
        const newCdWidth = cdWidth - scrollTop

         cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' :0
         cd.style.opacity = newCdWidth / cdWidth;
        }


        // xử lý khi click play

        playBtn.onclick = function () {
            // Đang playing thì isPlaying = false
            if (_this.isPlaying) {
                audio.pause();
            } else {
                // Đang pause thì sẽ Playing
                audio.play();
            }
        };
        // Khi song playing
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumAnimate.play();
        };
        // Khi song pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumAnimate.pause();
        };

       // khi tiến độ bài hát thay đổi
       audio.ontimeupdate = function() {
        if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100) 
            progress.value = progressPercent
        }
        
       }
       // xu lí khi tua bài hát
       progress.onchange = function(e) { 
           
           
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
       }

       // khi next song
       nextBtn.onclick = function() {
        if(_this.isRandom){
            _this.playRamdomSong()
        }
        else{
            _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActivitySong()
       }
       // khi prev song
       prevBtn.onclick = function() {
        if(_this.isRandom){
            _this.playRamdomSong()
        }
        else{
            _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActivitySong()
       }

       // ramdom bài hát
       randomBtn.onclick = function(e) { 
        _this.isRandom = !_this.isRandom
        randomBtn.classList.toggle("active", _this.isRandom)
       }

       // lặp lại bài hát
       repeatBtn.onclick = function() {
        _this.isRepeat = !_this.isRepeat
        repeatBtn.classList.toggle("active", _this.isRepeat)
       }

       //' xử lý next song khi audio ended
       audio.onended = function() { 
        if(_this.isRepeat) {
            audio.play()
        }
        else{
            nextBtn.click()
        }
       }


       // lắng nghe hành vi click vào playlist
       playlist.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active')
        if(songNode || e.target.closest('.option')){
            // xử lý click vao song
            if(songNode){
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCrruentSong()
                _this.render()
                audio.play()
            }
            // xử lý click vào song option
            if(e.target.closest('.option')){

            } 
        }
       }
    },



    scrollToActivitySong: function (){
      setTimeout(()=>{
        $('.song.active').scrollIntoView({
            behavior: 'smooth', 
            block:'nearest',
        })
      }, 100)
    },
    // loadCrruentSong
    loadCrruentSong: function () {
        

        heading.textContent = this.currentSong.name
        cdThumd.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

       
    },
    nextSong: function (){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCrruentSong()
    },
    prevSong: function (){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex =  this.songs.length -1
        }
        this.loadCrruentSong()
    },
    playRamdomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCrruentSong()

    },
    start: function(){
        // định nghĩa các thược tính cho object
        this.defineProperties()


        // lắng nghe / xử lý các sự kiện (DOM events)
        this.HandleEvent()

        // tải các thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCrruentSong()

        // render playlist
        this.render()
    }
}
app.start()