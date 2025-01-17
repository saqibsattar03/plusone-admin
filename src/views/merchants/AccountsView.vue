<template>
  <div>
    <v-row class="mb-4" v-if="tab === 0">
      <v-col cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Total Deposit</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>{{ restaurantProfile.totalDeposit || 0 }}</h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Current Balance</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>
              {{
                restaurantProfile.availableDeposit &&
                restaurantProfile.availableDeposit % 2 !== 0
                  ? restaurantProfile.availableDeposit.toFixed(2)
                  : restaurantProfile.availableDeposit || 0
              }}
            </h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Total Sales</v-card-title>
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
            <v-card-title class="text-center">Total Deduction</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>
              {{
                restaurantProfile.totalDeductions &&
                restaurantProfile.totalDeductions % 2 !== 0
                  ? restaurantProfile.totalDeductions.toFixed(2)
                  : restaurantProfile.totalDeductions || 0
              }}
            </h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="restaurantProfile.availableDeposit < 0" cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Pending Payments</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>
              {{
                restaurantProfile.availableDeposit &&
                restaurantProfile.availableDeposit % 2 !== 0
                  ? restaurantProfile.availableDeposit.toFixed(2)
                  : restaurantProfile.availableDeposit || 0
              }}
            </h1>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-container>
      <v-tabs v-model="tab">
        <v-tab v-for="item in tabItems" :key="item.id" @change="updatingTab()">
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
        value: 'amount',
        sortable: true
      },
      {
        text: 'Deduction',
        value: 'deductedAmount',
        sortable: true
      },
      {
        text: 'Transaction Type',
        value: 'transactionType',
        sortable: true
      },
      {
        text: 'Current Balance',
        value: 'availableDeposit',
        sortable: true
      }
    ],
    depositHeaders: [
      {
        text: 'Debited Amount',
        value: 'amount',
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
        value: 'availableDeposit',
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
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD');
    },
    formatTime(date) {
      return dayjs(date).format('HH:mm:ss');
    },

    updatingTab() {
      this.dataTableKey++;
    },

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

    async loadData() {
      const id = this.$route.query.restaurantId;

      if (this.voucher) {
        if (this.tab == 0) {
          const restaurantProfile = await this.merchants_service.fetchOne(id);
          this.restaurantProfile = restaurantProfile;

          const transactionHistory =
            await this.merchants_service.fetchOneTransactionHistory(id);

          transactionHistory.forEach((item) => {
            item.voucherType = item.voucherType ? item.voucherType : 'N/A';
            item.deductedAmount = item.deductedAmount
              ? item.deductedAmount && item.deductedAmount.toFixed(2)
              : 'N/A';
            item.availableDeposit =
              item.availableDeposit && item.availableDeposit.toFixed(2);
          });

          return transactionHistory;
        } else {
          const depositHistory =
            await this.merchants_service.fetchOneDepositHistory(id);

          depositHistory.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });

          return depositHistory;
        }
      }
    }
  }
};
</script>
