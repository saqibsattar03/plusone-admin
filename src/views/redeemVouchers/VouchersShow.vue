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
        <v-row
          class="pa-0 d-flex align-center justify-space-between"
          no-gutters
        >
          <v-card-title class="p10" style="color: #020819"
            >Redeem Voucher Details</v-card-title
          >

          <v-btn color="primary" @click="$router.go(-1)">
            <v-icon class="v-btn__pre-icon" small>mdi-arrow-left</v-icon>&nbsp;
            Back</v-btn
          >
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-card-text>
              <b>Title : </b>{{ voucher[0].voucherObject.title }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text>
              <b>Voucher Type : </b>{{ voucher[0].voucherObject.voucherType }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-card-text>
              <b>Description : </b>{{ voucher[0].voucherObject.description }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text>
              <b>Discount : </b>{{ voucher[0].voucherObject.discount + '%' }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-card-text>
              <b>Estimated Cost : </b
              >{{ voucher[0].voucherObject.estimatedCost }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text>
              <b>Estimated Savings : </b
              >{{ voucher[0].voucherObject.estimatedSavings }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-card-text>
              <b>Prefrence : </b
              >{{ voucher[0].voucherObject.voucherPreference }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text>
              <b>Disabled dates : </b>
              <ul>
                <li
                  v-for="date in voucher[0].voucherObject.voucherDisableDates"
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
import { getFullPath } from '../../utils/local';

export default {
  data() {
    return {
      dataLoading: true,
      voucher: {},
      redeem_vouchers_service: new RedeemVouchersService(),

      headers: [
        {
          text: 'Mind Feels',
          value: 'my_mind_feels',
          sortable: true
        },
        {
          text: 'Body Feels',
          value: 'my_body_feels',
          sortable: true
        },
        {
          text: 'Spirit Feels',
          value: 'my_spirit_feels',
          sortable: true
        },
        {
          text: 'Date',
          value: 'date',
          sortable: true
        }
      ]
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
        this.voucher = await this.redeem_vouchers_service.fetchOne(
          this.$route.query.id
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
