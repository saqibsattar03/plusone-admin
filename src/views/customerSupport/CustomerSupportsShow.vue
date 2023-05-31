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
          class="pa-0 d-flex align-center"
          style="margin-bottom: 12px"
          no-gutters
        >
          <v-btn @click="$router.go(-1)" elevation="0">
            <v-icon class="v-btn__pre-icon">mdi-arrow-left</v-icon></v-btn
          >
          <!--          <v-card-title class="p10" style="color: #020819"-->
          <!--            >Customer Support Details</v-card-title-->
          <!--          >-->
        </v-row>

        <!-- image show -->
        <v-row class="pa-0" no-gutters>
          <v-col v-if="customerSupport.file" cols="12">
            <v-card-text>
              <a :href="getFullPath(customerSupport.file)" target="_blank">
                <v-img
                  :src="getFullPath(customerSupport.file)"
                  width="100%"
                  height="350px"
                  contain
                ></v-img>
              </a>
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="First Name"
              v-model="customerSupport.userId.firstname"
            />
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Sur Name"
              v-model="customerSupport.userId.surname"
            />
          </v-col>
        </v-row>

        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Email"
              v-model="customerSupport.userId.email"
            />
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Contact Number"
              v-model="customerSupport.contactNumber"
            />
          </v-col>
        </v-row>
        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Subject"
              v-model="customerSupport.subject"
            />
          </v-col>
          <v-col cols="12" md="5">
            <v-textarea
              disabled
              outlined
              class="text-color"
              dense
              label="Complaint Message"
              v-model="customerSupport.message"
            />
          </v-col>
        </v-row>

        <!--        <v-row class="pa-0" style="justify-content: space-around" no-gutters>-->
        <!--          <v-col cols="12" md="5">-->
        <!--            <v-card-text class="p10">-->
        <!--              <b>Created At : </b>{{ formatDate(customerSupport.createdAt) }}-->
        <!--            </v-card-text>-->
        <!--          </v-col>-->
        <!--          <v-col cols="12" md="5"></v-col>-->
        <!--        </v-row>-->
      </div>
    </v-card>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import { CustomerSupportService } from '../../services/customer-support-service';
import { getFullPath } from '../../utils/local';

export default {
  data() {
    return {
      dataLoading: true,
      customerSupport: {},
      customer_support_service: new CustomerSupportService()
    };
  },
  methods: {
    getFullPath,
    formatDate(date) {
      return dayjs(date).format('D MMM YYYY - hh:mm A');
    },

    async loadUser() {
      try {
        this.dataLoading = true;
        this.customerSupport = await this.customer_support_service.fetchOne(
          this.$route.query.id
        );
      } catch (e) {
        console.log(e);
      }
      this.dataLoading = false;
    }
  },
  async mounted() {
    await this.loadUser();
  }
};
</script>
