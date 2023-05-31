<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    :allow-add="getUser() && getUser().role === 'ADMIN'"
    @add-new="addNew"
    @done="$router.back()"
    :delete-handler="
      getUser() && getUser().role === 'ADMIN' ? deleteQuote : null
    "
    :edit-handler="getUser() && getUser().role === 'ADMIN' ? edit : null"
  >
    <template #createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>
  </data-table>
</template>

<script>
import { QuotesService } from '../../services/quote-service';
import DataTable from '../../components/DataTable';
import { getUser } from '@/utils/local';
import dayjs from 'dayjs';

export default {
  components: { DataTable },

  data: () => ({
    items: [],
    quote_service: new QuotesService(),
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
    getUser,

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
