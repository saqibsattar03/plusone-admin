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
        <v-row class="d-flex align-center" no-gutters>
          <v-btn @click="$router.go(-1)" elevation="0">
            <v-icon>mdi-arrow-left</v-icon></v-btn
          >

          <v-card-title>Voucher Details</v-card-title>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <v-img height="250px" contain :src="voucherImg"></v-img>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Title : </b>{{ voucher.voucherObject[0].title }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Type : </b>{{ voucher.voucherObject[0].voucherType }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Voucher Preference : </b
              >{{ voucher.voucherObject[0].voucherPreference }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Discount : </b
              >{{
                voucher.voucherObject[0].discount
                  ? voucher.voucherObject[0].discount
                  : 'N/A'
              }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Estimated Cost: </b
              >{{ voucher.voucherObject[0].estimatedCost }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Estimated Savings : </b
              >{{ voucher.voucherObject[0].estimatedSavings }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Description : </b>{{ voucher.voucherObject[0].description }}
            </v-card-text>
          </v-col>

          <v-col
            cols="12"
            md="6"
            v-if="
              voucher.voucherObject[0].voucherDisableDates &&
              voucher.voucherObject[0].voucherDisableDates.length > 0
            "
          >
            <v-card-text class="p10">
              <b>Disable Dates : </b>

              <ul>
                <li
                  v-for="date in voucher.voucherObject[0].voucherDisableDates"
                  :key="date"
                >
                  {{ formatDate(date) }}
                </li>
              </ul>
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
      voucherImg: '',
      merchants_service: new MerchantsService()
    };
  },
  methods: {
    getFullPath,
    formatDate(date) {
      return dayjs(date).format('D MMM YYYY');
    },

    async loadVoucher() {
      try {
        this.dataLoading = true;

        this.voucher = await this.merchants_service.fetchOneVoucher({
          restaurantId: this.$route.query.restaurantId,
          voucherId: this.$route.query.voucherId
        });

        this.voucherImg = this.getFullPath(
          this.voucher.voucherObject[0].voucherImage
        );
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
