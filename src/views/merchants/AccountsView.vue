<template>
  <div>
    <v-row class="mb-4" v-if="tab === 0">
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Total Deposit:</v-card-title>
          <v-card-text class="text-center">
            <h1>{{ restaurantProfile.totalDeposit || 0 }}</h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Current Balance:</v-card-title>
          <v-card-text class="text-center">
            <h1>{{ restaurantProfile.availableDeposit || 0 }}</h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Total Sales:</v-card-title>
          <v-card-text class="text-center">
            <h1>
              {{ restaurantProfile.totalSales || 0 }}
            </h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Total Deduction:</v-card-title>
          <v-card-text class="text-center">
            <h1>{{ restaurantProfile.totalDeductions || 0 }}</h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="restaurantProfile.availableDeposit < 0" cols="12" md="3">
        <v-card>
          <v-card-title>Pending Payments:</v-card-title>
          <v-card-text class="text-center">
            <h1>{{ restaurantProfile.availableDeposit || 0 }}</h1>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-container>
      <v-tabs v-model="tab">
        <v-tab v-for="item in tabItems" :key="item.id">
          {{ item.tab }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item v-for="item in tabItems" :key="item.id">
          <DataTable
            :headers="tab == 0 ? transactionHeaders : depositHeaders"
            :title="item.title"
            :allow-add="false"
            :edit-handler="null"
            :view-handler="null"
            :delete-handler="null"
            :loader="loadData"
          >
            <template #deduction="{ item }">
              <span>{{ item.estimatedCost * 0.1 }}</span>
            </template>

            <template #currentBalance="{ item }">
              <span>{{
                restaurantProfile.totalDeposit - item.estimatedCost
              }}</span>
            </template>

            <template #debitedAmount="{ item }">
              <span>{{ item.amount }}</span>
            </template>

            <template #date="{ item }">
              <span>{{ formatDate(item.createdAt) }}</span>
            </template>

            <template #time="{ item }">
              <span>{{ formatTime(item.createdAt) }}</span>
            </template>
          </DataTable>
        </v-tab-item>
      </v-tabs-items>

      <loading-dialog v-model="dataLoading" message="Please wait..." />
    </v-container>
  </div>
</template>

<script>
import { MerchantsService } from '../../services/merchant-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '../../utils/local';
import { required } from '../../utils/validators';
import LoadingDialog from '../../components/LoadingDialog';
import dayjs from 'dayjs';

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

    transactionHeaders: [
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
        text: 'Current Balance',
        value: 'currentBalance',
        sortable: true
      }
    ],
    depositHeaders: [
      {
        text: 'Debited Amount',
        value: 'debitedAmount',
        sortable: true
      },
      {
        text: 'Date',
        value: 'date',
        sortable: true
      },
      {
        text: 'Time',
        value: 'time',
        sortable: true
      },
      {
        text: 'Current Balance',
        value: 'currentBalance',
        sortable: true
      }
    ],
    voucher: {},

    dateRange: [],
    voucherId: null
  }),

  methods: {
    required,

    formatDate(date) {
      return dayjs(date).format('DD/MMM/YYYY');
    },

    formatTime(date) {
      return dayjs(date).format('hh A');
    },

    async loadData() {
      const id = this.$route.query.restaurantId;

      const voucher = await this.merchants_service.fetchAllVoucher(id);
      this.voucher = voucher;

      if (this.voucher) {
        if (this.tab == 0) {
          const restaurantProfile = await this.merchants_service.fetchOne(id);
          this.restaurantProfile = restaurantProfile;
          console.log(restaurantProfile, 'restaurantProfile');

          const filterData = Object.values(voucher.voucherObject);
          return filterData;
        } else {
          const depositHistory =
            await this.merchants_service.fetchOneDepositHistory(id);
          const filterData = Object.values(depositHistory.depositObject);
          return filterData;
        }
      }
    }
  }
};
</script>
