<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Merchants"
    :allow-add="userScopes.includes('merchants:new') && true"
    @done="$router.back()"
    @add-new="addNew"
    :delete-handler="null"
    :edit-handler="userScopes.includes('merchants:edit') ? edit : null"
    :view-handler="userScopes.includes('merchants:view') ? view : null"
  >
    <template #firstname="{ item }">
      {{ item.firstname }} {{ item.surname }}
    </template>
  </data-table>
</template>

<script>
import { MerchantsService } from '../../services/merchant-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '../../utils/local';

export default {
  components: { DataTable },

  mounted() {
    this.loadData;
  },

  data: () => ({
    items: [],
    merchants_service: new MerchantsService(),
    userScopes: getUserScopes(),

    headers: [
      {
        text: 'Name',
        value: 'firstname',
        sortable: true
      },
      {
        text: 'Email',
        value: 'email',
        sortable: true
      }
    ]
  }),

  methods: {
    addNew() {
      this.$router.push('/merchant');
    },

    edit(item) {
      this.$router.push(`/merchant?id=${item._id}`);
    },

    view(item) {
      this.$router.push(`/merchant-details?id=${item._id}`);
    },

    async deleteUser(item) {
      await this.merchants_service.delete(item);
    },

    async loadData() {
      return await this.merchants_service.fetchAll();
    }
  }
};
</script>
