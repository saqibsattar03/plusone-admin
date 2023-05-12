<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Total Deposit:</v-card-title>
          <v-card-text class="text-center">
            <!-- <h1>{{ restaurantProfile.totalDeposit }}</h1> -->
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Avalable Deposit:</v-card-title>
          <v-card-text class="text-center">
            <!-- <h1>{{ restaurantProfile.availableDeposit }}</h1> -->
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Remaining Payments:</v-card-title>
          <v-card-text class="text-center">
            <h1>
              <!-- {{ restaurantProfile.totalSales }} -->
            </h1>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Total Sales:</v-card-title>
          <v-card-text class="text-center">
            <!-- <h1>{{ restaurantProfile.totalDeductions }}</h1> -->
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-title>Total Deduction:</v-card-title>
          <v-card-text class="text-center">
            <!-- <h1>{{ restaurantProfile.availableDeposit }}</h1> -->
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
      <template #transactionId="{ item }">
        {{ item.index }}
      </template>

      <template #date="{ item }">
        {{ item }}
      </template>
    </data-table>
  </div>
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
    merchantService: new MerchantsService(),
    userScopes: getUserScopes(),

    headers: [
      {
        text: 'Transaction Id',
        value: 'transactionId',
        sortable: true
      },
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
    async loadData() {
      let accountHistory =
        await this.merchantService.fetchAllTransactionHistory();

      console.log(accountHistory);
      return accountHistory;
    }
  }
};
</script>
