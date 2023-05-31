<template>
  <v-dialog v-if="!isEdit && !addNew" v-bind:value="value" width="80%" content-class="elevation-0" persistent>
    <div class="text-center mb-5">
      <v-btn fab small @click="closeVideo">
        <v-icon color="red" class="font-weight-bold">mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="video-container">
      <div class="progress" v-if="!videoLoading">
        <v-progress-circular
            indeterminate
            color="primary"
            size="50"
        ></v-progress-circular>
      </div>
      <video
          ref="video"
          :src="url"
          class="video"
          :loop="loop ? true:false"
          @play="updateIcon"
          @pause="updateIcon"
          @timeupdate="setSliderAndTimer"
          @loadeddata="videoLoaded"
      ></video>
      <div class="controls">
        <button ref="playPauseBtn" class="playPauseBtn" @click="toggleVideoStatus" title=Play/Pause>
          <v-icon :color="playPauseButtonColor">{{ playPauseButton }}</v-icon>
        </button>
        <button ref="stopBtn" class="stop" @click="stopVideo" title="Stop">
          <v-icon color="red">{{ stopButton }}</v-icon>
        </button>
        <input ref="slider" type="range" class="slider" value="0" @input="seeked"/>
        <p ref="timer" class="timer">00:00</p>
        <button ref="loopBtn" class="loop loop-off" title="Loop Video" @click="loop = !loop">
          <v-icon color="red">mdi-redo</v-icon>
        </button>
        <button ref="expandBtn" class="expand" title="full screen" @click="openFullscreen">
          <v-icon color="white">mdi-fullscreen</v-icon>
        </button>
      </div>
    </div>
  </v-dialog>
  <div v-else class="video-container">
    <div class="progress" v-if="!videoLoading">
      <v-progress-circular
          indeterminate
          color="primary"
          size="30"
      ></v-progress-circular>
    </div>
    <video
        ref="video"
        :src="url"
        class="video"
        :loop="loop ? true:false"
        @play="updateIcon"
        @pause="updateIcon"
        @timeupdate="setSliderAndTimer"
        @loadeddata="videoLoaded"
    ></video>
    <div class="controls">
      <button ref="playPauseBtn" class="playPauseBtn" @click.prevent="toggleVideoStatus" title=Play/Pause>
        <v-icon :color="playPauseButtonColor">{{ playPauseButton }}</v-icon>
      </button>
      <button ref="stopBtn" class="stop" @click="stopVideo" title="Stop">
        <v-icon color="red">{{ stopButton }}</v-icon>
      </button>
      <input ref="slider" type="range" class="slider" value="0" @input="seeked"/>
      <p ref="timer" class="timer">00:00</p>
      <button ref="loopBtn" class="loop loop-off" title="Loop Video" @click="loop = !loop">
        <v-icon color="red">mdi-redo</v-icon>
      </button>
      <button ref="expandBtn" class="expand" title="full screen" @click="openFullscreen">
        <v-icon color="white">mdi-fullscreen</v-icon>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  model: {
    prop: 'value',
    event: 'value',
  },
  props: {
    value: Boolean,
    url: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    addNew: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      playPauseButton: 'mdi-play',
      playPauseButtonColor: '#30ff30',
      stopButton: 'mdi-stop',
      loop: false,
      dialog: false,
      pause: false,
      videoLoading: false
    }
  },

  watch: {
    pause() {
      this.$refs.video.pause();
    }
  },

  methods: {
    videoLoaded() {
      this.$emit('mediaLoaded')
      this.videoLoading = true
    },
    updateIcon() {
      if (this.$refs.video.paused) {
        this.playPauseButton = 'mdi-play'
        this.playPauseButtonColor = '#30ff30';
      } else {
        this.playPauseButton = 'mdi-pause';
        this.playPauseButtonColor = '#f4f4f4';
      }
    },
    toggleVideoStatus() {
      if (this.$refs.video.paused) {
        this.$refs.video.play();
      } else {
        this.$refs.video.pause();
      }
    },
    stopVideo() {
      this.$refs.video.currentTime = 0;
      this.setSliderAndTimer();
      this.$refs.video.pause();
    },
    setSliderAndTimer() {
      //get minutes
      let minutes = Math.floor(this.$refs.video.currentTime / 60);
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      //get seconds
      let seconds = Math.floor(this.$refs.video.currentTime % 60);
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      this.$refs.timer.textContent = `${minutes}:${seconds}`;
      const check = (this.$refs.video.currentTime / this.$refs.video.duration) * 100;
      if (isNaN(check)) {
        this.$refs.slider.value = '0'
      } else {
        this.$refs.slider.value = String(check)
      }
      if (this.$refs.video.currentTime == this.$refs.video.duration) {
        this.$refs.slider.value = '0';
        this.stopVideo();
      }
    },

    closeVideo() {
      // this.dialog = !this.dialog;
      this.pause = !this.pause;
      this.$emit('value', false)
    },
    seeked() {
      this.$refs.video.currentTime = (this.$refs.slider.value / 100) * this.$refs.video.duration;
    },
    openFullscreen() {
      if (this.$refs.video.requestFullscreen) {
        this.$refs.video.requestFullscreen();
      } else if (this.$refs.video.mozRequestFullScreen) {
        /* Firefox */
        this.$refs.video.mozRequestFullScreen();
      } else if (this.$refs.video.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        this.$refs.video.webkitRequestFullscreen();
      } else if (this.$refs.video.msRequestFullscreen) {
        /* IE/Edge */
        this.$refs.video.msRequestFullscreen();
      }
    }
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, Helvetica, sans-serif;
}

.video-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.progress {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%,-50%);
}

.video {
  width: 70%;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.controls {
  width: 70%;
  padding: 5px;
  display: flex;
  align-items: center;
  background: #505050;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.controls * {
  margin: 0 2px;
  padding: 1px;
}

.slider {
  width: 100%;
  height: 0.5rem;
}

.timer {
  color: #f4f4f4;
}

.controls button {
  background: transparent;
  color: #f4f4f4;
  border: none;
}

.controls .playPauseBtn {
  color: #30ff30;
}

.controls .stop {
  color: #ff3030;
}

.loop.loop-on {
  color: #a9a9ff;
}

i {
  pointer-events: none;
}

button,
input[type="range"] {
  cursor: pointer;
}

@media screen and (max-width: 920px) {
  .video,
  .controls {
    width: 90%;
  }
}
</style>
