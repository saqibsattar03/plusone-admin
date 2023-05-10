<template>
  <div>
    <v-row class="mb-4" v-if="tab === 0">
      <v-col cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Total Deposit:</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>{{ restaurantProfile.totalDeposit || 0 }}</h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Current Balance:</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>{{ restaurantProfile.availableDeposit || 0 }}</h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Total Sales:</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>
              {{ restaurantProfile.totalSales || 0 }}
            </h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Total Deduction:</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>{{ restaurantProfile.totalDeductions || 0 }}</h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="restaurantProfile.availableDeposit < 0" cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Pending Payments:</v-card-title>
          </div>
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
            :allow-deposit="tab === 0 ? false : true"
            @add-deposit="depositDialog = !depositDialog"
            :edit-handler="null"
            :view-handler="null"
            :delete-handler="null"
            :loader="loadData"
            :key="dataTableKey"
          >
            <template #deduction="{ item }">
              <span>{{ item.estimatedCost * 0.1 }}</span>
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

    <v-dialog v-model="depositDialog" max-width="500px">
      <v-card>
        <v-card-text
          class="text-center py-6"
          style="font-size: 24px; font-weight: bold"
          >Deposit Form</v-card-text
        >
        <v-card-text>
          <v-form ref="depositForm" @submit.prevent="depositMoneyFn">
            <v-text-field
              label="Restaurant Name"
              v-model="restaurantProfile.restaurantName"
              outlined
              disabled
            ></v-text-field>
            <v-text-field
              label="Amount"
              v-model.number="depositMoney.depositObject.amount"
              type="number"
              outlined
              :rules="[required('Amount must be provided')]"
            ></v-text-field>
            <v-btn color="primary" type="submit">Submit</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
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
    depositDialog: false,
    dataTableKey: 0,
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
    depositMoney: {
      restaurantId: '',
      depositObject: {
        amount: null
      }
    },

    dateRange: [],
    voucherId: null
  }),

  methods: {
    required,

    async depositMoneyFn() {
      if (
        this.$refs.depositForm.validate() &&
        confirm('Are you sure you want to deposit money?')
      ) {
        this.dataLoading = true;
        this.depositMoney.restaurantId = this.$route.query.restaurantId;

        await this.merchants_service
          .depositMoney(this.depositMoney)
          .then(() => {
            this.dataTableKey++;
            this.dataLoading = false;
            this.depositDialog = false;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },

    formatDate(date) {
      return dayjs(date).format('DD/MMM/YYYY');
    },

    formatTime(date) {
      return dayjs(date).format('hh:mm A ');
    },

    async loadData() {
      const id = this.$route.query.restaurantId;

      const voucher = await this.merchants_service.fetchAllVoucher(id);
      this.voucher = voucher;

      if (this.voucher) {
        if (this.tab == 0) {
          const restaurantProfile = await this.merchants_service.fetchOne(id);
          this.restaurantProfile = restaurantProfile;

          let filterData = voucher.voucherObject;

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
