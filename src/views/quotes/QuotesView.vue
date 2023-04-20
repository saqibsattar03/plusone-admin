<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Quotes"
    :allow-add="userScopes.includes('quotes:new')"
    @add-new="addNew"
    @done="$router.back()"
    :delete-handler="userScopes.includes('quotes:delete') ? deleteQuote : null"
    :edit-handler="userScopes.includes('quotes:edit') ? edit : null"
  >
    <template #createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>
  </data-table>
</template>

<script>
import { QuotesService } from '../../services/quote-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '@/utils/local';
import dayjs from 'dayjs';

export default {
  components: { DataTable },

  data: () => ({
    items: [],
    quote_service: new QuotesService(),
    userScopes: getUserScopes(),
    headers: [
      {
        text: 'Quote',
        value: 'quoteText',
        sortable: true
      },
      {
        text: 'Created At',
        value: 'createdAt',
        sortable: true
      }
    ]
  }),
  methods: {
    formatDate(date) {
      return dayjs(date).format('D MMM YYYY');
    },

    addNew() {
      this.$router.push('/quote');
    },
    edit(item) {
      this.$router.push(`/quote?id=${item._id}`);
    },
    async deleteQuote(item) {
      await this.quote_service.delete(item);
    },
    async loadData() {
      return await this.quote_service.fetchAll();
    }
  }
};
</script>
