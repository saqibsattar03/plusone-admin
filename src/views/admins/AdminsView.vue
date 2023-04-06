<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Admins"
    :allow-add="userScopes.includes('admins:new')"
    @add-new="addNew"
    @done="$router.back()"
    :delete-handler="null"
    :edit-handler="edit"
  >
  </data-table>
</template>

<script>
import { AdminsService } from '@/services/admin-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '@/utils/local';
export default {
  components: { DataTable },

  data: () => ({
    items: [],
    admin_service: new AdminsService(),
    userScopes: getUserScopes(),
    headers: [
      {
        text: 'Username',
        value: 'username',
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
      this.$router.push('/admin');
    },
    edit(item) {
      this.$router.push(`/admin?id=${item._id}`);
    },
    view(item) {
      this.$router.push(`/admin-details?id=${item._id}`);
    },
    async deleteAdmin(item) {
      await this.admin_service.delete(item);
    },
    async loadData() {
      return await this.admin_service.fetchAll();
    }
  }
};
</script>
