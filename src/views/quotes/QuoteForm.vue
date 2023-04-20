<template>
  <SimpleForm
    :is-edit="isEdit"
    :disabled="disabled"
    :onSubmit="submit"
    @done="$router.back()"
  >
    <v-row class="span-2" no-gutters>
      <v-btn @click="$router.back()" elevation="0">
        <v-icon>mdi-arrow-left</v-icon></v-btn
      >

      <p class="form__title" style="width: 90%">
        {{ isEdit ? 'Update Quote' : 'Add New Quote' }}
      </p>
    </v-row>

    <v-textarea
      v-model="quote.quoteText"
      :rules="[required('Quote must be provided')]"
      class="span-2"
      label="Quote"
      outlined
    ></v-textarea>

    <loading-dialog v-model="loading" message="Fetching Quote Data" />
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import { QuotesService } from '../../services/quote-service';
import LoadingDialog from '../../components/LoadingDialog';
import { required } from '../../utils/validators';

export default {
  name: 'AdminForm',
  components: { LoadingDialog, SimpleForm },

  data: () => ({
    isEdit: false,
    loading: false,
    quote_service: new QuotesService(),

    // only for edit
    disabled: false,
    quote: {
      quoteText: ''
    }
  }),

  mounted() {
    this.loadQuote();
  },

  methods: {
    required,

    async loadQuote() {
      if (!this.$route.query.id) return;
      this.isEdit = true;
      this.loading = true;
      this.quote = await this.quote_service.fetchOne(this.$route.query.id);
      this.loading = false;
    },
    async submit(context) {
      if (this.isEdit) {
        context.changeLoadingMessage('Updating Quote');

        try {
          //updating quote
          await this.quote_service.update(this.quote);
          return true;
        } catch (e) {
          context.reportError({
            title: 'Error while updating Quote',
            description: e.response
              ? e.response.data.message
              : 'Something went wrong!'
          });
          return false;
        }
      } else {
        context.changeLoadingMessage('Creating Quote');
        try {
          // creating quote
          await this.quote_service.create(this.quote);
          return true;
        } catch (e) {
          context.reportError({
            title: 'Error while creating Quote',
            description: e.response
              ? e.response.data.message
              : 'Something went wrong!'
          });

          return false;
        }
      }
    }
  }
};
</script>

<style scoped>
p {
  font-weight: bold;
  text-align: left;
}
</style>
