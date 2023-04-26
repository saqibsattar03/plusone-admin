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
        <v-row class="pa-0 d-flex justify-start span-2" no-gutters>
          <v-btn @click="$router.go(-1)">
            <v-icon class="v-btn__pre-icon">mdi-arrow-left</v-icon></v-btn
          >
        </v-row>
        <v-card-title class="p10" style="color: #020819"
          >Merchant Details</v-card-title
        >

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Resturant Name : </b>{{ merchant.restaurantName }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Contact Number : </b>{{ merchant.phoneNumber }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Description : </b>{{ merchant.description }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Location Name : </b>{{ merchant.locationName }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Voucher Count : </b>{{ merchant.totalVoucherCount }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Unique Code : </b>{{ merchant.uniqueCode }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0 my-5" no-gutters>
          <v-card-title>Merchant Media:</v-card-title>
          <v-carousel
            v-if="media.length > 0"
            height="300"
            class="span-2 mb-4"
            hide-delimiters
            show-arrows-on-hover
          >
            <v-carousel-item
              contain
              v-for="(image, index) in media"
              :key="index"
              :src="image"
              style="object-fit: cover"
            ></v-carousel-item>
          </v-carousel>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Tags : </b
              ><span v-for="tag in merchant.tags" :key="tag">{{
                tag + ', '
              }}</span>
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Dietary Restrictions : </b>
              <span
                v-for="dietary in merchant.dietaryRestrictions"
                :key="dietary"
                >{{ dietary + ', ' }}</span
              >
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Culinary Options : </b
              ><span
                v-for="culinary in merchant.culinaryOptions"
                :key="culinary"
                >{{ culinary + ', ' }}</span
              >
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Sponsored : </b>{{ merchant.isSponsored }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Created At : </b>{{ formatDate(merchant.createdAt) }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Updated At : </b>{{ formatDate(merchant.updatedAt) }}
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
      merchants_service: new MerchantsService(),

      media: [],
      menu: ''
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

        this.merchant.media.forEach((media) => {
          this.media.push(this.getFullPath(media));
        });
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
