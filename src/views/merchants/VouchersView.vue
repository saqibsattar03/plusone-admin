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
    >
      <template #description="{ item }">
        {{
          item.description.length > 30
            ? `${item.description.substr(0, 30)}...`
            : `${item.description.substr(0, 30)}`
        }}
      </template>
      <template #discount="{ item }">
        {{ item.discount ? item.discount + '%' : 'Null' }}
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
  </div>
</template>

<script>
import { MerchantsService } from '../../services/merchant-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '../../utils/local';
import { required } from '../../utils/validators';

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
        text: 'Voucher Preference',
        value: 'voucherPreference',
        sortable: true
      },
      {
        text: 'Description',
        value: 'description',
        sortable: true
      }
    ],
    voucher: {},
    disableDialog: false,

    dateRange: null,
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

    disable(item) {
      this.voucherId = item._id;
      this.disableDialog = true;
    },

    async disableVoucher() {
      if (this.dateRange.length > 0) {
        alert('Please select a date');
      } else {
        console.log(this.dateRange);
        await this.merchants_service.disableVoucher({
          voucherId: this.voucherId,
          startDate: this.dateRange[0],
          endDate: this.dateRange[1]
        });

        this.voucherId = null;
        this.dateRange = null;
        this.disableDialog = false;
      }
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
