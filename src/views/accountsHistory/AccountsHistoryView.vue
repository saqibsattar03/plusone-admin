<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Total Deposit</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>
              {{ adminStats && adminStats[0] && adminStats[0].totalDeposit }}
            </h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Avalable Deposit</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>
              {{
                adminStats && adminStats[0] && adminStats[0].availableDeposit
              }}
            </h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        md="3"
        v-if="adminStats && adminStats[0] && adminStats[0].availableDeposit < 0"
      >
        <v-card>
          <div style="display: flex; justify-content: center" class="mb-n4">
            <v-card-title class="text-center">Remaining Payments</v-card-title>
          </div>
          <v-card-text class="text-center">
            <h1>
              {{
                adminStats && adminStats[0] && adminStats[0].availableDeposit
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
          <!-- <v-card-title>Total Sales:</v-card-title> -->
          <v-card-text class="text-center">
            <h1>
              {{ adminStats && adminStats[0] && adminStats[0].totalSales }}
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
              {{ adminStats && adminStats[0] && adminStats[0].totalDeductions }}
            </h1>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <data-table
      :loader="loadData"
      :headers="headers"
      title="Accounts History"
      @done="$router.back()"
    >
      <template #date="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #time="{ item }">
        {{ formatTime(item.createdAt) }}
      </template>

      <template #restaurantName="{ item }">
        {{ item && item.restaurantName }}
      </template>
    </data-table>
  </div>
</template>

<script>
import { MerchantsService } from '../../services/merchant-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '../../utils/local';
import dayjs from 'dayjs';

export default {
  components: { DataTable },

  mounted() {
    this.loadData;
  },

  data: () => ({
    items: [],
    adminStats: [],
    merchantService: new MerchantsService(),
    userScopes: getUserScopes(),

    headers: [
      {
        text: 'Restaurant Name',
        value: 'restaurantName',
        sortable: true
      },
      {
        text: 'Amount',
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
        text: 'Credit/Debit',
        value: 'transactionType',
        sortable: true
      },

      {
        text: 'Current Balance',
        value: 'availableDeposit',
        sortable: true
      }
    ]
  }),

  methods: {
    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD');
    },

    formatTime(date) {
      return dayjs(date).format('HH:mm:ss');
    },

    async loadData() {
      let adminStats = await this.merchantService.accountsAdminStats();
      this.adminStats = adminStats;

      let accountHistory =
        await this.merchantService.fetchAllTransactionHistory();

      let filteredAccountHistory = await Promise.all(
        accountHistory.map(async (item) => {
          await this.merchantService.fetchOne(item.restaurantId).then((res) => {
            item.restaurantName = res.restaurantName;
          });
          return item;
        })
      );
      return filteredAccountHistory;
    }
  }
};
</script>
