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
          <v-col cols="12" md="4">
            <v-card-text class="p10">
              <b>Name : </b>{{ user.firstname }} {{ user.surname }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="4">
            <v-card-text class="p10">
              <b>Status : </b>{{ user.status }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="4">
            <v-card-text class="p10">
              <b>Email : </b>{{ user.email }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="4">
            <v-card-text class="p10">
              <b>Created At : </b>{{ formatDate(user.createdAt) }}
            </v-card-text>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>
<script>
import dayjs from 'dayjs';
import { UsersService } from '../../services/user-service';
import { getFullPath } from '../../utils/local';

export default {
  data() {
    return {
      dataLoading: true,
      user: {},
      users_service: new UsersService(),

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
      return dayjs(date).format('D MMM YYYY - hh:mm A');
    },

    async loadUser() {
      try {
        this.dataLoading = true;
        this.user = await this.users_service.fetchOne(this.$route.query.id);
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
