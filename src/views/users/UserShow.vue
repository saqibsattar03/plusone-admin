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
        <v-row class="pa-0 d-flex align-center" no-gutters>
          <v-btn @click="$router.go(-1)" elevation="0">
            <v-icon class="v-btn__pre-icon">mdi-arrow-left</v-icon></v-btn
          >
          <v-card-title class="p10" style="color: #020819"
            >User Details</v-card-title
          >
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>First Name : </b>{{ user[0].firstname }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Sur Name : </b>{{ user[0].surname }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Email : </b>{{ user[0].email }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Status : </b>{{ user[0].status }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Account Type : </b>{{ user[0].accountType }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Account Holder Type : </b>{{ user[0].accountHolderType }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12">
            <v-card-text class="p10">
              <b>Bio : </b>{{ user[0].bio ? user[0].bio : 'Null' }}
            </v-card-text>
          </v-col>

          <!-- <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Social Links : </b>
              {{ user.socialLinks }}
            </v-card-text>
          </v-col> -->
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Favorite Restaurants : </b>
              <ul>
                <li
                  v-for="restaurant in user[0].favoriteRestaurants"
                  :key="restaurant"
                >
                  {{ restaurant }}
                </li>
              </ul>
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Favorite Chefs : </b>
              <ul>
                <li v-for="chef in user[0].favoriteChefs" :key="chef">
                  {{ chef }}
                </li>
              </ul>
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12">
            <v-card-text class="p10">
              <b>Dietary Requirements : </b>
              <ul>
                <li v-for="dietary in user[0].dietRequirements" :key="dietary">
                  {{ dietary }}
                </li>
              </ul>
            </v-card-text>
          </v-col>
        </v-row>

        <v-row
          v-if="this.user[0].status != 'ACTIVE'"
          class="pa-0 mt-8"
          no-gutters
        >
          <v-col cols="12" class="d-flex justify-end">
            <v-btn color="primary" @click="approveUser">Approve</v-btn>
          </v-col>
        </v-row>
        <v-row v-else class="pa-0 mt-8" no-gutters>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn color="primary" disabled>Approved</v-btn>
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
    },

    async approveUser() {
      this.dataLoading = true;
      await this.$axios
        .patch('/persons/change-status?userId=' + this.$route.query.id)
        .then(async () => {
          this.dataLoading = false;
          await this.loadUser();
        });
    }
  },
  async mounted() {
    await this.loadUser();
  }
};
</script>
