<template>
  <v-container>
    <v-tabs v-model="tab">
      <v-tab v-for="item in tabItems" :key="item.id">
        {{ item.tab }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in tabItems" :key="item.id">
        <DataTable
          :headers="headers"
          :title="item.title"
          :allow-add="false"
          :edit-handler="null"
          :view-handler="null"
          :delete-handler="null"
          :loader="loadData"
        >
        </DataTable>
      </v-tab-item>
    </v-tabs-items>

    <loading-dialog v-model="dataLoading" message="Please wait..." />
  </v-container>
</template>

<script>
import { MerchantsService } from '../../services/merchant-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '../../utils/local';
import { required } from '../../utils/validators';
import LoadingDialog from '../../components/LoadingDialog';

export default {
  components: { DataTable, LoadingDialog },

  mounted() {
    this.loadData;
  },

  data: () => ({
    items: [],
    merchants_service: new MerchantsService(),
    userScopes: getUserScopes(),
    dataLoading: false,
    restaurantProfile: {},

    tab: 0,
    tabItems: [
      {
        id: 1,
        tab: 'Transaction History',
        title: 'Transaction History'
      },
      {
        id: 2,
        tab: 'Deposit History',
        title: 'Deposit History'
      }
    ],

    headers: [
      {
        text: 'Voucher Type',
        value: 'voucherType',
        sortable: true
      },
      {
        text: 'Sale Price',
        value: 'estimatedCost',
        sortable: true
      },
      {
        text: 'Deduction',
        value: 'deduction',
        sortable: true
      },
      {
        text: 'Balance',
        value: 'balance',
        sortable: true
      }
    ],
    voucher: {},

    dateRange: [],
    voucherId: null
  }),

  methods: {
    required,

    async loadData() {
      const id = this.$route.query.restaurantId;

      const voucher = await this.merchants_service.fetchAllVoucher(id);
      this.voucher = voucher;
      if (this.voucher) {
        const filterData = Object.values(voucher.voucherObject);

        const restaurantProfile = await this.merchants_service.fetchOne(id);
        this.restaurantProfile = restaurantProfile;

        if (this.tab == 0) {
          console.log('tab', this.tab);
          return filterData;
        } else {
          console.log('tab', this.tab);
          return filterData;
        }
      }
    }
  }
};
</script>
