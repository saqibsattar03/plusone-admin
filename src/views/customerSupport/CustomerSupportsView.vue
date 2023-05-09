<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Customer Supports"
    :allow-add="false"
    :delete-handler="
      getUser() && getUser().role === 'ADMIN' ? deleteCustomerSupport : null
    "
    :view-handler="getUser() && getUser().role === 'ADMIN' ? view : null"
    @done="$router.back()"
  >
    <template #subject="{ item }">
      {{
        item && item.subject && item.subject.length > 30
          ? item.subject.substring(0, 30) + '...'
          : item.subject
      }}
    </template>

    <template #message="{ item }">
      {{
        item && item.message && item.message.length > 50
          ? item.message.substring(0, 50) + '...'
          : item.message
      }}
    </template>

    <template #createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>
  </data-table>
</template>

<script>
import { CustomerSupportService } from '../../services/customer-support-service';
import DataTable from '../../components/DataTable';
import dayjs from 'dayjs';
import { getUser } from '../../utils/local';

export default {
  components: { DataTable },

  data: () => ({
    items: [],
    customer_support_service: new CustomerSupportService(),
    headers: [
      {
        text: 'Subject',
        value: 'subject',
        sortable: true
      },
      {
        text: 'Message',
        value: 'message',
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

    view(item) {
      this.$router.push(`/customer-supports-details?id=${item._id}`);
    },

    async deleteCustomerSupport(item) {
      await this.customer_support_service.delete(item);
    },

    async loadData() {
      console.log('loadData');
      console.log(this.customer_support_service.fetchAll());
      return await this.customer_support_service.fetchAll();
    }
  }
};
</script>
