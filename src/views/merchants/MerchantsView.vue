<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Merchants"
    :allow-add="getUser() && getUser().role === 'ADMIN'"
    @done="$router.back()"
    @add-new="addNew"
    :delete-handler="null"
    :edit-handler="getUser() && getUser().role === 'ADMIN' ? edit : null"
    :view-handler="getUser() && getUser().role === 'ADMIN' ? view : null"
    :voucher-handler="voucherView"
    :account-handler="null"
  >
  </data-table>
</template>

<script>
import { MerchantsService } from '../../services/merchant-service';
import DataTable from '../../components/DataTable';
import { getUser } from '../../utils/local';

export default {
  components: { DataTable },

  mounted() {
    this.loadData;
  },

  data: () => ({
    user: getUser(),
    items: [],
    merchants_service: new MerchantsService(),

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
        value: 'uniqueCode'
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
    getUser,

    addNew() {
      this.$router.push('/merchant');
    },

    edit(item) {
      this.$router.push(`/merchant?id=${item._id}`);
    },

    view(item) {
      this.$router.push(`/merchant-details?id=${item._id}`);
    },

    voucherView(item) {
      this.$router.push(`/vouchers?restaurantId=${item._id}`);
    },

    accountHandler(item) {
      this.$router.push(`/account-details?restaurantId=${item._id}`);
    },

    async deleteUser(item) {
      await this.merchants_service.delete(item);
    },

    async loadData() {
      if (this.user.role === 'ADMIN') {
        const merchants = await this.merchants_service.fetchAll();
        this.merchants = merchants;

        return this.merchants;
      } else {
        const merchants = await this.merchants_service.fetchAll();
        this.merchants = merchants;
        this.merchants = this.merchants.filter(
          (merchant) =>
            merchant.restaurantData.length > 0 &&
            merchant.restaurantData[0].userId === this.user._id
        );

        return this.merchants;
      }
    }
  }
};
</script>
