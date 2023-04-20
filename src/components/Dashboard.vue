<template>
  <div>
    <v-app-bar app dark color="primary" elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer" />

      <v-card-title>PlusOne</v-card-title>
      <v-spacer />

      <profile-popup />
    </v-app-bar>
    <v-main class="main-bg">
      <v-container>
        <router-view />
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="drawer" app>
      <img
        src="../assets/plus-one-logo.svg"
        alt="logo"
        class="logo mb-10"
        height="70"
      />
      <!-- <v-card-title>PlusOne</v-card-title> -->
      <v-divider />
      <template v-for="(route, key) in routes">
        <v-list-item
          v-if="route.isVisible && route.title !== 'Online Courses'"
          :key="key"
          class="route"
          color="#da57a7"
          active-class="route--active"
          exact
          dense
          :to="route.to"
        >
          <v-list-item-icon v-if="!route.icon.includes('svg')">
            <v-icon v-text="route.icon" />
          </v-list-item-icon>
          <v-list-item-icon v-if="route.icon.includes('svg')">
            <img :src="require(`../assets/${route.icon}`)" alt="" width="20" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="route.title" />
          </v-list-item-content>
        </v-list-item>
        <v-divider
          v-else-if="route.isDivider"
          :key="route.title"
          style="margin: 10px 20px"
        />

        <v-expansion-panels
          :key="route.id"
          v-if="route.isVisible && route.title === 'Online Courses'"
          flat
        >
          <v-expansion-panel>
            <v-expansion-panel-header class="rounded" @click="getActiveList">
              <v-list-item
                v-if="route.isVisible && route.title === 'Online Courses'"
                :key="key"
                class="route"
                color="#da57a7"
                active-class="route--active"
                exact
                dense
                :to="route.to"
              >
                <v-list-item-icon v-if="!route.icon.includes('svg')">
                  <v-icon v-text="route.icon" color="primary" />
                </v-list-item-icon>
                <v-list-item-icon v-if="route.icon.includes('svg')">
                  <img
                    :src="require(`../assets/${route.icon}`)"
                    alt=""
                    width="20"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="route.title" />
                </v-list-item-content>
              </v-list-item>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list-item
                v-for="(route, index) in route.subSections"
                :key="index"
                class="route"
                color="#da57a7"
                active-class="route--active"
                exact
                dense
                :to="route.to"
              >
                <v-list-item-icon v-if="!route.icon.includes('svg')">
                  <v-icon v-text="route.icon" color="primary" />
                </v-list-item-icon>
                <v-list-item-icon v-if="route.icon.includes('svg')">
                  <img
                    :src="require(`../assets/${route.icon}`)"
                    alt=""
                    width="20"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="route.title" />
                </v-list-item-content>
              </v-list-item>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import ProfilePopup from './ProfilePopup';
import { required } from '@/utils/validators';
import { getUserScopes, getUser } from '../utils/local';

export default {
  name: 'Dashboard',
  components: {
    ProfilePopup
  },
  data: () => ({
    drawer: true,
    user: getUser(),
    userScopes: getUserScopes(),
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
    }
  },
  computed: {
    routes() {
      // TODO Need to Change isVisible back to using Scopes
      return [
        {
          to: '/',
          title: 'Users',
          icon: 'mdi-account-group',
          isVisible: this.userScopes?.includes('users:view')
        },
        {
          to: '/admins',
          title: 'Admins',
          icon: 'mdi-account-group',
          isVisible:
            this.userScopes?.includes('admins:view') &&
            this.user.role === 'ADMIN'
        },
        {
          to: '/no-permission',
          title: 'No Permission',
          icon: 'mdi-cancel',
          isVisible: false
        },

        { isDivider: true },

        {
          to: '/merchants',
          title: 'Merchants',
          icon: 'mdi-store',
          isVisible: this.userScopes?.includes('merchants:view')
        },
        {
          to: '/redeem-vouchers',
          title: 'Redeem Vouchers',
          icon: 'mdi-ticket',
          isVisible: this.userScopes?.includes('redeem-vouchers:view')
        },
        {
          to: '/quotes',
          title: 'Quotes',
          icon: 'mdi-format-quote-close',
          isVisible:
            this.userScopes?.includes('quotes:view') &&
            this.user.role === 'ADMIN'
        }
      ];
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
  background: linear-gradient(to bottom, #FF6E01 300px, white 300px)
  height: 200px
</style>

<style lang="sass">
.v-expansion-panel-header
  padding: 0px !important
  padding-right: 10px !important
  margin: 0px !important
  min-height: 40px !important
  height: 40px !important

.v-expansion-panel-header:hover
  background-color: rgba(128,128,128,0.07)

.v-expansion-panel--active > .v-expansion-panel-header .v-list-item__title
  color: #FF6E01

.v-expansion-panel--active .v-list-item__icon
  margin-right: 16px !important

.v-expansion-panel--active  .v-expansion-panel-header__icon
  margin-right: 10px !important

.v-expansion-panel--active > .v-expansion-panel-header
  min-height: 40px !important
  background-color: rgba(48,98,210,0.15)
  padding: 0 !important
  margin: 0 !important
  margin-left: 5px !important

.v-expansion-panel
  padding: 0 !important
  margin: 0 !important
</style>
