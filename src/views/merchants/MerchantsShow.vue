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
        <v-card-title class="p10" style="color: #020819"
          >Merchant Details</v-card-title
        >

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Name : </b>{{ merchant.name }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Status : </b>{{ merchant.status }}
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
      merchant: {},
      merchants_service: new MerchantsService()
    };
  },
  methods: {
    getFullPath,
    formatDate(date) {
      return dayjs(date).format('D MMM YYYY - hh:mm A');
    },

    async loadMerchant() {
      try {
        this.dataLoading = true;
        this.merchant = await this.merchants_service.fetchOne(
          this.$route.query.id
        );
      } catch (e) {
        console.log(e);
      }
      this.dataLoading = false;
    }
  },
  async mounted() {
    await this.loadMerchant();
  }
};
</script>
