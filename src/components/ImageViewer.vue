<template>
  <v-dialog v-if="!isEdit && !addNew" v-bind:value="value" width="80%" content-class="elevation-0">
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="my-1" dark v-bind="attrs" v-on="on" small color="primary">
        View
      </v-btn>
    </template>
    <div class="text-center mb-5">
      <v-btn fab small @click="close">
        <v-icon color="red" class="font-weight-bold">mdi-close</v-icon>
      </v-btn>
    </div>
    <v-container class="article-container">
      <div>
        <img
            v-if="url"
            :src="url"
            height="400"
            style="width: 100%; object-fit: contain"
            :alt="url"
        />
      </div>
    </v-container>
  </v-dialog>
  <v-container v-else>
    <div>
      <img
          v-if="url"
          :src="url"
          height="150"
          style="width: 100%; object-fit: contain"
          :alt="url"
      />
    </div>
  </v-container>
</template>

<script>

export default {
  name: "ArticleViewer",
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
      dialog: false,
    };
  },
  methods: {
    close() {
      this.$emit('value', false)
    }
  }
}
</script>