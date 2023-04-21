<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Users"
    :allow-add="false"
    @done="$router.back()"
    :delete-handler="null"
    :edit-handler="null"
    :view-handler="userScopes.includes('users:view') ? view : null"
  >
    <template #firstname="{ item }">
      {{ item.firstname }}
    </template>
  </data-table>
</template>

<script>
import { UsersService } from '@/services/user-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '../../utils/local';

export default {
  components: { DataTable },

  mounted() {
    this.loadData;
  },

  data: () => ({
    items: [],
    users_service: new UsersService(),
    userScopes: getUserScopes(),

    headers: [
      {
        text: 'First Name',
        value: 'firstname',
        sortable: true
      },
      {
        text: 'Surname',
        value: 'surname',
        sortable: true
      },
      {
        text: 'Email',
        value: 'email',
        sortable: true
      },
      {
        text: 'Status',
        value: 'status',
        sortable: true
      },
      {
        text: 'Account Type',
        value: 'accountType',
        sortable: true
      },
      {
        text: 'Account Holder Type',
        value: 'accountHolderType',
        sortable: true
      }
    ]
  }),

  methods: {
    // addNew() {
    //   this.$router.push('/user');
    // },

    // edit(item) {
    //   this.$router.push(`/user?id=${item._id}`);
    // },

    view(item) {
      this.$router.push(`/user-details?id=${item._id}`);
    },

    async deleteUser(item) {
      await this.users_service.delete(item);
    },

    async loadData() {
      return await this.users_service.fetchAll();
    }
  }
};
</script>
