<template>
  <div>
    <v-card class="mx-auto pa-6" max-width="800">
      <v-overlay
        v-if="dataLoading"
        :absolute="dataLoading"
        color="primary"
        opacity="0.55"
      >
        <v-progress-circular indeterminate color="#fff"></v-progress-circular>
        <span style="color: #fff; margin-left: 10px"> Please Wait... </span>
      </v-overlay>

      <div v-else>
        <v-row class="pa-0 d-flex justify-end span-2" no-gutters>
          <v-btn color="primary" @click="$router.go(-1)">
            <v-icon class="v-btn__pre-icon" small>mdi-arrow-left</v-icon>&nbsp;
            Back</v-btn
          >
        </v-row>

        <v-card-title class="p10" style="color: #020819"
          >Voucher Details</v-card-title
        >

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Title : </b>{{ voucher[0].voucherObject.title }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Type : </b>{{ voucher[0].voucherObject.voucherType }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Voucher Preference : </b
              >{{ voucher[0].voucherObject.voucherPreference }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Discount : </b
              >{{
                voucher[0].voucherObject.discount
                  ? voucher[0].voucherObject.discount
                  : 'N/A'
              }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Estimated Cost: </b
              >{{ voucher[0].voucherObject.estimatedCost }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Estimated Savings : </b
              >{{ voucher[0].voucherObject.estimatedSavings }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12">
            <v-card-text class="p10">
              <b>Description : </b>{{ voucher[0].voucherObject.description }}
            </v-card-text>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import { MerchantsService } from '../../services/merchant-service';
import { getFullPath } from '../../utils/local';

export default {
  data() {
    return {
      dataLoading: true,
      voucher: {},
      merchants_service: new MerchantsService()
    };
  },
  methods: {
    getFullPath,
    formatDate(date) {
      return dayjs(date).format('D MMM YYYY - hh:mm A');
    },

    async loadVoucher() {
      try {
        this.dataLoading = true;

        let voucher = await this.merchants_service.fetchOneVoucher({
          restaurantId: this.$route.query.restaurantId,
          voucherId: this.$route.query.voucherId
        });

        this.voucher = voucher;

        console.log(this.voucher, 'this.voucher');
      } catch (e) {
        console.log(e);
      }
      this.dataLoading = false;
    }
  },
  async mounted() {
    await this.loadVoucher();
  }
};
</script>
