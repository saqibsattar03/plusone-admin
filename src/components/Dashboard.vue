<template>
  <div>
    <v-app-bar color="rgba(255, 125, 0, 0.08)" app elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-card-title>{{ this.title }}</v-card-title>
      <v-spacer />
      <profile-popup />
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="drawer" app>
      <a href="/"
        ><img
          src="../assets/plus-one-logo.svg"
          alt="logo"
          class="logo mb-10"
          height="70"
      /></a>
      <v-divider />
      <template v-for="(route, key) in routes">
        <v-list-item
          v-if="route.isVisible && route.title !== 'Online Courses'"
          :key="key"
          class="route drawer-menu-item"
          color="#da57a7"
          active-class="route--active"
          exact
          :to="route.to"
        >
          <v-list-item-icon v-if="!route.icon.includes('svg')">
            <v-icon class="drawer-menu-item-icon" v-text="route.icon" />
          </v-list-item-icon>
          <v-list-item-icon v-if="route.icon.includes('svg')">
            <img :src="require(`../assets/${route.icon}`)" alt="" width="20" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="drawer-menu-item-title"
              v-text="route.title"
            />
          </v-list-item-content>
        </v-list-item>
      </template>
      <template v-slot:append>
        <div class="pa-2" style="margin-bottom: 24px">
          <v-card
            color="#ffede0"
            elevation="0"
            style="margin: 0 12px 12px 12px"
          >
            <v-row>
              <v-col cols="3">
                <v-avatar color="orange" size="42" style="margin-left: 8px">
                  <img src="user.jpg" alt="John" /> </v-avatar
              ></v-col>
              <v-col
                cols="4"
                style="
                  display: flex;
                  align-items: center;
                  margin-left: 16px;
                  margin-right: 8px;
                "
                ><h3>Admin</h3></v-col
              >
              <v-col cols="3" style="display: flex; align-items: center"
                ><i
                  class="icon pi pi-sign-out"
                  style="color: blue; cursor: pointer"
                  @click="logout"
                ></i
              ></v-col>
            </v-row>
          </v-card>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import ProfilePopup from './ProfilePopup';
import { required } from '@/utils/validators';
import { getUser } from '../utils/local';

export default {
  name: 'Dashboard',
  components: {
    ProfilePopup
  },
  data: () => ({
    drawer: true,
    user: getUser(),
    developMode: false,
    developModeDialog: false,
    message: null,
    developModeData: null,
    loading: false
  }),
  methods: {
    required,

    getActiveList() {
      const links = document.querySelectorAll('nav a');
      links.forEach((el) => {
        el.classList.remove('v-list-item--active');
      });
    },
    logout() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_user_scopes');

      this.$router.push('/auth/sign-in');
    }
  },
  computed: {
    routes() {
      // TODO Need to Change isVisible back to using Scopes
      return [
        {
          to: '/',
          title: 'Users',
          icon: 'icon pi pi-users',
          isVisible: this.user?.role === 'ADMIN'
        },
        // {
        //   to: '/admins',
        //   title: 'Admins',
        //   icon: 'mdi-account-group',
        //   isVisible: this.user?.role === 'ADMIN'
        // },
        {
          to: '/no-permission',
          title: 'No Permission',
          icon: 'mdi-cancel',
          isVisible: false
        },

        {
          to: '/merchants',
          title: 'Merchants',
          icon: 'mdi-store',
          isVisible:
            this.user?.role === 'ADMIN' || this.user?.role === 'MERCHANT'
        },
        {
          to: '/redeem-vouchers',
          title: 'Redeemed Vouchers',
          icon: 'mdi-ticket',
          isVisible: this.user?.role === 'ADMIN'
        },
        {
          to: '/accounts-history',
          title: 'Accounts History',
          icon: 'icon pi pi-history',
          isVisible: this.user?.role === 'ADMIN'
        },
        {
          to: '/quotes',
          title: 'Quotes',
          icon: 'icon pi pi-book',
          isVisible: this.user?.role === 'ADMIN'
        },
        {
          to: '/customer-supports',
          title: 'Customer Support',
          icon: 'mdi-account-question',
          isVisible: this.user?.role === 'ADMIN'
        }
      ];
    },
    title() {
      // }
      switch (this.$route.path) {
        case '/':
          return 'Users';
        case '/user-details':
          return 'User Details';
        case '/merchants':
        case '/merchant':
          if (this.$route.query && this.$route.query.id) {
            return 'Edit Merchant';
          }
          return 'Merchants';
        case '/merchant-details':
          return 'Merchant Details';
        case '/account-details':
          return 'Account Details';
        case '/vouchers':
          return 'Voucher';
        case '/voucher':
          return 'Edit Voucher';
        case '/voucher/':
          return 'Add New Voucher';
        case '/voucher-details':
          return 'Voucher Details';
        case '/redeem-vouchers':
          return 'Redeemed Vouchers';
        case '/redeem-voucher-details':
          return 'Redeemed Vouchers Details';
        case '/accounts-history':
          return 'Accounts History';
        case '/quotes':
          return 'Quote';
        case '/quote':
          if (this.$route.query && this.$route.query.id) {
            return 'Edit Quote';
          }
          return 'Add new Quote';
        case '/customer-supports':
          return 'Customer Support';
        case '/customer-supports-details':
          return 'Customer Support Details';
        default:
          return 'Users';
      }
    }
  }
};
</script>

<style lang="sass" scoped>

.logo
  display: block
  margin: 5px auto
  margin-top: 20px
  border-radius: 10px

.route
  margin: 5px
  text-align: left
  overflow: hidden
  border-radius: 4px
  font-size: 20px !important
  font-family: "Roboto", sans-serif

  i
    font-size: 20px

  &--active i
    color: inherit

  &--active
    color: #FF6E01

.main-bg
  background: linear-gradient(to bottom, #FF6E01 400px, white 400px)
  height: 320px
</style>

<style lang="sass">
.v-expansion-panel-header
  padding: 0px !important
  padding-right: 10px !important
  margin: 0px !important
  min-height: 40px !important
  height: 40px !important

.v-expansion-panel-header:hover
  background-color: rgba(128, 128, 128, 0.07)

.v-expansion-panel--active > .v-expansion-panel-header .v-list-item__title
  color: #FF6E01

.v-expansion-panel--active .v-list-item__icon
  margin-right: 16px !important

.v-expansion-panel--active .v-expansion-panel-header__icon
  margin-right: 10px !important

.v-expansion-panel--active > .v-expansion-panel-header
  min-height: 40px !important
  background-color: rgba(48, 98, 210, 0.15)
  padding: 0 !important
  margin: 0 !important
  margin-left: 5px !important

.v-expansion-panel
  padding: 0 !important
  margin: 0 !important


.drawer-menu-item:hover
  background-color: white

.drawer-menu-item:hover .drawer-menu-item-icon
  color: #ffad45

.drawer-menu-item:hover .drawer-menu-item-title
  color: #ffad45
</style>
