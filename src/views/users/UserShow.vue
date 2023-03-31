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
          >User Details</v-card-title
        >

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>First Name : </b>{{ user.firstname }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Sur Name : </b>{{ user.surname }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Email : </b>{{ user.email }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Status : </b>{{ user.status }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Account Type : </b>{{ user.accountType }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Account Holder Type : </b>{{ user.accountHolderType }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Links : </b
              >{{ user.socialLinks.length > 0 ? user.socialLinks : 'Null' }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Dietary Requirements : </b
              >{{
                user.dietRequirements.length > 0
                  ? user.dietRequirements
                  : 'Null'
              }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Favorite Restaurants : </b
              >{{
                user.favoriteRestaurants.length > 0
                  ? user.favoriteRestaurants
                  : 'Null'
              }}
            </v-card-text>
          </v-col>

          <v-col cols="12" md="6">
            <v-card-text class="p10">
              <b>Favorite Chefs : </b
              >{{ user.favoriteChefs.length > 0 ? user.favoriteChefs : 'Null' }}
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" no-gutters>
          <v-col cols="12">
            <v-card-text class="p10">
              <b>Bio : </b>{{ user.bio ? user.bio : 'Null' }}
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
        console.log(this.user);
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
