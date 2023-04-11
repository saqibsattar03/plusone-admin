<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Redeem Vouchers"
    @done="$router.back()"
    :view-handler="userScopes.includes('redeem-vouchers:view') ? view : null"
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

    <template #discount="{ item }">
      {{ item.vouc.discount + '%' }}
    </template>
  </data-table>
</template>

<script>
import { RedeemVouchersService } from '@/services/redeem-vouchers-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '../../utils/local';

export default {
  components: { DataTable },

  mounted() {
    this.loadData;
  },

  data: () => ({
    items: [],
    redeem_vouchers_service: new RedeemVouchersService(),
    userScopes: getUserScopes(),

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
      },
      {
        text: 'Discount',
        value: 'discount',
        sortable: true
      }
    ]
  }),

  methods: {
    view(item) {
      this.$router.push(`/redeem-voucher-details?id=${item.vouc._id}`);
    },

    async loadData() {
      return await this.redeem_vouchers_service.fetchAll();
    }
  }
};
</script>
