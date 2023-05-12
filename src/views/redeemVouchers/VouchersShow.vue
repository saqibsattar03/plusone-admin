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
            <v-icon class="v-btn__pre-icon">mdi-arrow-left</v-icon></v-btn
          >
          <v-card-title class="p10" style="color: #020819"
            >Redeemed Voucher Details</v-card-title
          >
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <v-img height="250px" contain :src="voucherImg"></v-img>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12">
            <v-card-text>
              <b>Merchant Name : </b>{{ merchant.restaurantName }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-card-text>
              <b>Title : </b>{{ voucher.voucherObject[0].title }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text>
              <b>Voucher Type : </b>{{ voucher.voucherObject[0].voucherType }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-card-text>
              <b>Description : </b>{{ voucher.voucherObject[0].description }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text>
              <b>Discount : </b>{{ voucher.voucherObject[0].discount + '%' }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-card-text>
              <b>Estimated Cost : </b
              >{{ voucher.voucherObject[0].estimatedCost }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text>
              <b>Estimated Savings : </b
              >{{ voucher.voucherObject[0].estimatedSavings }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-card-text>
              <b>Prefrence : </b
              >{{ voucher.voucherObject[0].voucherPreference }}
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
            <v-card-text>
              <b>Disabled dates : </b>
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
import { RedeemVouchersService } from '../../services/redeem-vouchers-service';
import { MerchantsService } from '../../services/merchant-service';
import { getFullPath } from '../../utils/local';

export default {
  data() {
    return {
      dataLoading: true,
      voucher: {},
      voucherImg: '',
      redeem_vouchers_service: new RedeemVouchersService(),
      merchants_service: new MerchantsService()
    };
  },
  methods: {
    formatDate(date) {
      return dayjs(date).format('D MMM YYYY');
    },

    async loadVoucher() {
      try {
        this.dataLoading = true;
        this.voucher = await this.redeem_vouchers_service.fetchOne(
          this.$route.query.id
        );
        await this.loadVoucherImg();
        await this.loadMerchant();
      } catch (e) {
        console.log(e);
      }
      this.dataLoading = false;
    },

    async loadVoucherImg() {
      this.voucherImg = getFullPath(this.voucher.voucherObject[0].voucherImage);
    },

    async loadMerchant() {
      try {
        this.dataLoading = true;
        this.merchant = await this.merchants_service.fetchOne(
          this.voucher.restaurantId
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
