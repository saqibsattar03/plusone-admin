<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Redeemed Vouchers"
    @done="$router.back()"
    :view-handler="getUser() && getUser().role === 'ADMIN' ? view : null"
  >
    <template #title="{ item }">
      {{ item.vouc.title }}
    </template>

    <template #voucherType="{ item }">
      {{ item.vouc.voucherType }}
    </template>

    <template #voucherPreference="{ item }">
      {{ item.vouc.voucherPreference }}
    </template>
  </data-table>
</template>

<script>
import { RedeemVouchersService } from '@/services/redeem-vouchers-service';
import DataTable from '../../components/DataTable';
import { getUser } from '../../utils/local';

export default {
  components: { DataTable },

  mounted() {
    this.loadData;
  },

  data: () => ({
    items: [],
    redeem_vouchers_service: new RedeemVouchersService(),

    headers: [
      {
        text: 'Title',
        value: 'title',
        sortable: true
      },
      {
        text: 'Voucher Type',
        value: 'voucherType',
        sortable: true
      },
      {
        text: 'Voucher Preference',
        value: 'voucherPreference',
        sortable: true
      }
    ]
  }),

  methods: {
    getUser,

    view(item) {
      this.$router.push(`/redeem-voucher-details?id=${item.vouc._id}`);
    },

    async loadData() {
      return await this.redeem_vouchers_service.fetchAll();
    }
  }
};
</script>
