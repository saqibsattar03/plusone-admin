<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Vouchers"
    :allow-add="true"
    @done="$router.back()"
    @add-new="addNew"
    :delete-handler="null"
    :edit-handler="edit"
    :view-handler="null"
  >
    <template #description="{ item }">
      {{
        item.description.length > 30
          ? `${item.description.substr(0, 30)}...`
          : `${item.description.substr(0, 30)}`
      }}
    </template>
    <!-- <template #restaurantName="{ item }">
      {{ item }}
    </template> -->
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
        text: 'Voucher Type',
        value: 'voucherType',
        sortable: true
      },
      {
        text: 'Discount %',
        value: 'discount',
        sortable: true
      },
      {
        text: 'Description',
        value: 'description',
        sortable: true
      }
    ],
    voucher: {}
  }),

  methods: {
    addNew() {
      this.$router.push(`/voucher/?id=${this.$route.query.restaurantId}`);
    },

    edit(item) {
      this.$router.push(
        `/voucher?restaurantId=${this.$route.query.restaurantId}&voucherId=${item._id}`
      );
    },

    view(item) {
      this.$router.push(`/voucher-details?id=${item._id}`);
    },

    async deleteUser(item) {
      await this.merchants_service.deleteVoucher(item);
    },

    async loadData() {
      const id = this.$route.query.restaurantId;

      const voucher = await this.merchants_service.fetchAllVoucher(id);
      this.voucher = voucher;
      const filterData = Object.values(voucher.voucherObject);
      return filterData;
    }
  }
};
</script>
