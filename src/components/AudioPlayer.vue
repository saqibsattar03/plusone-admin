<template>
  <div>
    <v-dialog
      v-bind:value="value"
      v-if="!isEdit && !addNew"
      width="80%"
      content-class="elevation-0"
    >
      <div class="text-center mb-5">
        <v-btn fab small @click="closeAudio">
          <v-icon color="red" class="font-weight-bold">mdi-close</v-icon>
        </v-btn>
      </div>

      <v-container class="audio-container">
        <div class="player" :class="{ background: thumbnail }">
          <div class="image-box">
            <v-img v-if="thumbnail" :src="thumbnail" contain />
            <!--            <v-img v-else-if="type === 'Audio'" src="../assets/default-thumbnail.png" height="200" class="mb-5" contain/>-->
            <!--            <v-img v-else-if="type === 'Podcast'" src="../assets/Podcast.png" height="200" class="mb-5" contain/>-->
          </div>
          <audio controls ref="audio" @loadeddata="sendDuration($event)">
            <source :src="url" />
          </audio>
        </div>
      </v-container>
    </v-dialog>
    <v-container
      v-if="filename !== 'filename' && isEdit"
      class="audio-container"
    >
      <div class="player" v-if="filename">
        <audio controls ref="audio">
          <source :src="url" />
        </audio>
      </div>
    </v-container>

    <v-container v-if="filename === 'filename'">
      <audio controls ref="audio" @loadeddata="sendDuration($event)">
        <source :src="url" />
      </audio>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'AudioPlayer',
  model: {
    prop: 'value',
    event: 'value'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    filename: {
      type: String
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    addNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      pause: false
    };
  },
  watch: {
    pause() {
      this.$refs.audio.pause();
    },
    dialog: {
      handler(newValue) {
        this.show = newValue;
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    closeAudio() {
      this.show = !this.dialog;
      this.pause = !this.pause;
      this.$emit('value', false);
    },
    sendDuration(e) {
      this.$emit('audioDuration', e.target.duration);
    }
  }
};
</script>

<style scoped>
.audio-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.player {
  position: relative;
  width: 350px;
}

.background {
  background: #f1f3f4;
}

.image-box {
  width: 100%;
}

.player audio {
  width: 100%;
  outline: none;
}
</style>
