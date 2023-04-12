<template>
  <div>
    <data-table
      :loader="loadData"
      :headers="headers"
      title="Vouchers"
      :allow-add="true"
      @done="$router.back()"
      @add-new="addNew"
      :delete-handler="null"
      :edit-handler="edit"
      :view-handler="view"
      :disable-handler="disable"
      :allow-back="true"
      :key="dataTableKey"
    >
      <template #title="{ item }">
        {{
          item.title.length > 30
            ? `${item.title.substr(0, 30)}...`
            : `${item.title.substr(0, 30)}`
        }}
      </template>
    </data-table>

    <v-dialog v-model="disableDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Disable Voucher</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-date-picker
                  v-model="dateRange"
                  multiple
                  full-width
                ></v-date-picker>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="disableDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="disableVoucher">
            Disable
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <loading-dialog v-model="dataLoading" message="Please wait..." />
  </div>
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
    dataTableKey: 0,

    headers: [
      {
        text: 'Voucher Title',
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
    ],
    voucher: {},
    disableDialog: false,

    dateRange: [],
    voucherId: null
  }),

  methods: {
    required,

    addNew() {
      this.$router.push(`/voucher/?id=${this.$route.query.restaurantId}`);
    },

    edit(item) {
      this.$router.push(
        `/voucher?restaurantId=${this.$route.query.restaurantId}&voucherId=${item._id}`
      );
    },

    view(item) {
      this.$router.push(
        `/voucher-details?restaurantId=${this.$route.query.restaurantId}&voucherId=${item._id}`
      );
    },

    async disable(item) {
      this.voucherId = item._id;
      this.dateRange = item.voucherDisableDates
        ? item.voucherDisableDates.map((date) => {
            return new Date(date).toISOString().substring(0, 10);
          })
        : [];
      this.disableDialog = true;
    },

    async disableVoucher() {
      this.dataLoading = true;

      let ISOStringDate = this.dateRange.map((date) => {
        return new Date(date).toISOString();
      });
      await this.merchants_service.disableVoucher({
        voucherId: this.voucherId,
        voucherDisableDates: ISOStringDate
      });

      this.dataTableKey = this.dataTableKey + 1;
      this.dataLoading = false;
      this.disableDialog = false;
    },

    async deleteUser(item) {
      await this.merchants_service.deleteVoucher(item);
    },

    async loadData() {
      const id = this.$route.query.restaurantId;

      const voucher = await this.merchants_service.fetchAllVoucher(id);
      this.voucher = voucher;
      if (this.voucher) {
        const filterData = Object.values(voucher.voucherObject);
        return filterData;
      }
    }
  }
};
</script>
