<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    :allow-add="false"
    :delete-handler="
      getUser() && getUser().role === 'ADMIN' ? deleteCustomerSupport : null
    "
    :view-handler="getUser() && getUser().role === 'ADMIN' ? view : null"
    @done="$router.back()"
  >
    <template #name="{ item }">
      {{
        item && item.userId && item.userId.firstname + ' ' + item.userId.surname
      }}
    </template>

    <template #email="{ item }">
      {{ item && item.userId && item.userId.email }}
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
        text: 'Name',
        value: 'name',
        sortable: true
      },
      {
        text: 'Email',
        value: 'email',
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
      let data = await this.customer_support_service.fetchAll();
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return data;
    }
  }
};
</script>
