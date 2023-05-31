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
        </v-row>

        <v-row class="pa-0" no-gutters style="justify-content: space-around">
          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="First Name"
              v-model="user[0].firstname"
            />
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              dense
              class="text-color"
              label="Sur Name"
              v-model="user[0].surname"
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
              v-model="user[0].email"
            />
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field
              disabled
              class="text-color"
              outlined
              dense
              label="Status"
              v-model="user[0].status"
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
              label="Account Type"
              v-model="user[0].accountType"
            />
          </v-col>

          <v-col cols="12" md="5">
            <v-text-field
              disabled
              outlined
              class="text-color"
              dense
              label="Account Holder Type"
              v-model="user[0].accountHolderType"
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
              label="Bio"
              v-model="user[0].bio"
            />
          </v-col>
          <v-col cols="12" md="5"></v-col>
        </v-row>

        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-card-text class="p10">
              <b>Favorite Restaurants : </b>
              <ul class="no-bullet">
                <li
                  v-for="restaurant in user[0].favoriteRestaurants"
                  :key="restaurant"
                >
                  <v-chip class="chips-gap">{{ restaurant }}</v-chip>
                </li>
              </ul>
            </v-card-text>
          </v-col>

          <v-col cols="12" md="5">
            <v-card-text class="p10">
              <b>Favorite Chefs : </b>

              <ul class="no-bullet">
                <li v-for="chef in user[0].favoriteChefs" :key="chef">
                  <v-chip class="chips-gap"> {{ chef }}</v-chip>
                </li>
              </ul>
            </v-card-text>
          </v-col>
        </v-row>

        <v-row class="pa-0" style="justify-content: space-around" no-gutters>
          <v-col cols="12" md="5">
            <v-card-text class="p10">
              <b>Dietary Requirements : </b>

              <ul class="no-bullet">
                <li v-for="dietary in user[0].dietRequirements" :key="dietary">
                  <v-chip class="chips-gap">{{ dietary }}</v-chip>
                </li>
              </ul>
            </v-card-text>
          </v-col>
          <v-col cols="12" md="5">
            <v-card-text class="p10">
              <b>Favorite Cuisines : </b>

              <ul class="no-bullet">
                <li v-for="cuisine in user[0].favoriteCuisines" :key="cuisine">
                  <v-chip class="chips-gap">{{ cuisine }}</v-chip>
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
  },
  computed: {
    bioValue: {
      get() {
        return this.user.length > 0 ? this.user[0].bio : 'Not Given';
      },
      set(value) {
        if (this.user.length > 0) {
          this.user[0].bio = value;
        }
      }
    }
  }
};
</script>
>
<style lang="sass">
ul.no-bullet
  list-style-type: none
  padding: 0
  margin: 0
.chips-gap
  margin-top: 6px
.text-color input:disabled
  color: #020819
</style>
