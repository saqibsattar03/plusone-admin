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
          class="pa-0 d-flex justify-start span-2"
          style="margin-bottom: 12px"
          no-gutters
        >
          <v-btn @click="$router.go(-1)" elevation="0">
            <v-icon class="v-btn__pre-icon">mdi-arrow-left</v-icon></v-btn
          >
        </v-row>

        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Merchant Name"
              v-model="merchant.restaurantName"
            />
          </v-col>
          <!--          <v-col cols="12" md="6">-->
          <!--            <v-card-text class="p10">-->
          <!--              <b>Resturant Name : </b>{{ merchant.restaurantName }}-->
          <!--            </v-card-text>-->
          <!--          </v-col>-->

          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Contact Number"
              v-model="merchant.phoneNumber"
            />
          </v-col>
          <!--          <v-col cols="12" md="6">-->
          <!--            <v-card-text class="p10">-->
          <!--              <b>Contact Number : </b>{{ merchant.phoneNumber }}-->
          <!--            </v-card-text>-->
          <!--          </v-col>-->
        </v-row>

        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-textarea
              disabled
              outlined
              class="text-color"
              dense
              label="Description"
              v-model="merchant.description"
            />
          </v-col>
          <!--          <v-col cols="12" md="6">-->
          <!--            <v-card-text class="p10">-->
          <!--              <b>Description : </b>{{ merchant.description }}-->
          <!--            </v-card-text>-->
          <!--          </v-col>-->

          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Location"
              v-model="merchant.locationName"
            />
          </v-col>
          <!--          <v-col cols="12" md="6">-->
          <!--              -->
          <!--            <v-card-text class="p10">-->
          <!--              <b>Location Name : </b>{{ merchant.locationName }}-->
          <!--            </v-card-text>-->
          <!--          </v-col>-->
        </v-row>

        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Voucher Count"
              v-model="merchant.totalVoucherCount"
            />
          </v-col>
          <!--          <v-col cols="12" md="6">-->
          <!--            <v-card-text class="p10">-->
          <!--              <b>Voucher Count : </b>{{ merchant.totalVoucherCount }}-->
          <!--            </v-card-text>-->
          <!--          </v-col>-->

          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Unique Code"
              v-model="merchant.uniqueCode"
            />
          </v-col>
          <!--          <v-col cols="12" md="6">-->
          <!--            <v-card-text class="p10">-->
          <!--              <b>Unique Code : </b>{{ merchant.uniqueCode }}-->
          <!--            </v-card-text>-->
          <!--          </v-col>-->
        </v-row>
        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Sponsored"
              v-model="merchant.isSponsored"
            />
          </v-col>
          <v-col cols="12" md="5"></v-col>
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

        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-card-text class="p10">
              <b>Tags : </b>
              <ul class="no-bullet">
                <li class="chips-gap" v-for="tag in merchant.tags" :key="tag">
                  <v-chip>{{ tag }}</v-chip>
                </li>
              </ul>
              <!--              ><span v-for="tag in merchant.tags" :key="tag">{{-->
              <!--                tag + ', '-->
              <!--              }}</span>-->
            </v-card-text>
          </v-col>

          <v-col cols="12" md="5">
            <v-card-text class="p10">
              <b>Dietary Restrictions : </b>
              <ul class="no-bullet">
                <li
                  class="chips-gap"
                  v-for="dietary in merchant.dietaryRestrictions"
                  :key="dietary"
                >
                  <v-chip>{{ dietary }}</v-chip>
                </li>
              </ul>
              <!--              <span-->
              <!--                v-for="dietary in merchant.dietaryRestrictions"-->
              <!--                :key="dietary"-->
              <!--                >{{ dietary + ', ' }}</span-->
              <!--              >-->
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-card-text class="p10">
              <b>Culinary Options : </b>
              <ul class="no-bullet">
                <li
                  class="chips-gap"
                  v-for="culinary in merchant.culinaryOptions"
                  :key="culinary"
                >
                  <v-chip>{{ culinary }}</v-chip>
                </li>
              </ul>

              <!--                <span-->
              <!--                v-for="culinary in merchant.culinaryOptions"-->
              <!--                :key="culinary"-->
              <!--                >{{ culinary + ', ' }}</span-->
              <!--              >-->
            </v-card-text>
          </v-col>
          <v-col cols="12" md="5"></v-col>
        </v-row>

        <!--        <v-row class="pa-0" no-gutters>-->
        <!--          <v-col cols="12" md="6">-->
        <!--            <v-card-text class="p10">-->
        <!--              <b>Created At : </b>{{ formatDate(merchant.createdAt) }}-->
        <!--            </v-card-text>-->
        <!--          </v-col>-->

        <!--          <v-col cols="12" md="6">-->
        <!--            <v-card-text class="p10">-->
        <!--              <b>Updated At : </b>{{ formatDate(merchant.updatedAt) }}-->
        <!--            </v-card-text>-->
        <!--          </v-col>-->
        <!--        </v-row>-->
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
