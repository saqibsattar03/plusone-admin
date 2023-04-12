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
    :voucher-handler="voucherView"
  >
    <template #restaurantName="{ item }">
      {{ item.restaurantData[0] && item.restaurantData[0].restaurantName }}
    </template>

    <template #locationName="{ item }">
      {{
        item.restaurantData[0] && item.restaurantData[0].locationName
          ? item.restaurantData[0].locationName > 30
            ? `${item.restaurantData[0].locationName.substr(0, 30)}...`
            : `${item.restaurantData[0].locationName.substr(0, 30)}`
          : ''
      }}
    </template>

    <template #restaurantCode="{ item }">
      {{ item.restaurantData[0] && item.restaurantData[0].uniqueCode }}
    </template>

    <template #isSponsored="{ item }">
      {{
        item.restaurantData[0] && item.restaurantData[0].isSponsored
          ? 'Yes'
          : 'No'
      }}
    </template>

    <template #phoneNumber="{ item }">
      {{ item.restaurantData[0] && item.restaurantData[0].phoneNumber }}
    </template>
  </data-table>
</template>

<script>
import { MerchantsService } from '../../services/merchant-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '../../utils/local';
// import Vue from 'vue';

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
        text: 'Merchant Name',
        value: 'restaurantName',
        sortable: true
      },
      {
        text: 'Location',
        value: 'locationName'
      },
      {
        text: 'Restaurant Code',
        value: 'restaurantCode'
      },
      {
        text: 'Sponsored',
        value: 'isSponsored'
      },
      {
        text: 'Contact',
        value: 'phoneNumber'
      }
    ],

    merchants: [],
    apiKey: 'AIzaSyCqP_po3VVErDM_bd9sGVUmMNDJwEhHyUA'
  }),

  methods: {
    addNew() {
      this.$router.push('/merchant');
    },

    edit(item) {
      this.$router.push(`/merchant?id=${item.restaurantData[0]._id}`);
    },

    view(item) {
      this.$router.push(`/merchant-details?id=${item.restaurantData[0]._id}`);
    },

    voucherView(item) {
      this.$router.push(`/vouchers?restaurantId=${item.restaurantData[0]._id}`);
    },

    async deleteUser(item) {
      await this.merchants_service.delete(item);
    },

    async loadData() {
      const merchants = await this.merchants_service.fetchAll();
      this.merchants = merchants;
      this.merchants = this.merchants.filter(
        (merchant) => merchant.restaurantData.length > 0
      );

      return this.merchants;
    }
  }
};
</script>
