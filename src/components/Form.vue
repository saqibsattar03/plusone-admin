<template>
  <v-card
      :class="[ hasElevation ? 'elevation-2' : 'elevation-0']"
      class="form"
  >
    <v-form ref="form" class="form__body">
      <slot/>
    </v-form>

    <div class="form__actions">
      <slot :context="submitContext" name="actions"/>

      <v-btn :disabled="disabled" color="primary" elevation="0" @click="submit">
        <span style="padding: 0 10px">{{isEdit?'Update':'Save'}}</span>
      </v-btn>
    </div>

    <loading-dialog v-model="loading" :message="loadingMessage"/>
    <error-dialog v-model="error" :error="errorVal"/>
  </v-card>
</template>

<script>
import LoadingDialog from './LoadingDialog';
import ErrorDialog from './ErrorDialog';

export default {
  name: 'SimpleForm',
  components: {ErrorDialog, LoadingDialog},

  props: {
    onSubmit: {
      type: Function,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    hasElevation: {
      type: Boolean,
      default: true
    },
    resetForm: {
      type: Boolean,
      default: false
    },
    isEdit:{
      type: Boolean,
      default: false,
    }
  },

  data: () => ({
    error: false,
    loading: false,
    errorVal: {},
    loadingMessage: '',
    submitContext: {}
  }),

  watch: {
    resetForm() {
      this.$refs.form.reset();
    }
  },

  mounted() {
    this.submitContext.validate = this.$refs.form.validate;
    this.submitContext.reportError = this.reportError;
    this.submitContext.changeLoadingStatus = this.changeLoadingStatus;
    this.submitContext.changeLoadingMessage = this.changeLoadingMessage;
  },

  methods: {
    changeLoadingStatus(status = true) {
      this.loading = status;
    },
    changeLoadingMessage(message) {
      this.loadingMessage = message;
    },
    reportError(error) {
      this.error = true;
      this.errorVal = error;
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.changeLoadingStatus(true);
        if (await this.onSubmit(this.submitContext)) {
          this.changeLoadingStatus(false);
          this.$refs.form.reset();
          this.$emit('done');
        } else {
          this.changeLoadingStatus(false);
        }
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.form
  width: 600px
  padding: 40px
  margin: 50px auto
  border-radius: 8px

  &__body
    display: grid
    max-width: 100%
    grid-column-gap: 20px
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)

  &__actions
    display: flex
    margin-top: 30px
    justify-content: flex-end
</style>

<style lang="sass">
.span-2
  grid-column: 1 / 3

.form
  &__title
    font-weight: normal !important
    text-align: center !important
    font-size: 27px
    padding-bottom: 20px
    font-family: google-sans, sans-serif

</style>
