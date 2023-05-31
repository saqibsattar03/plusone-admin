<template>
  <div style="margin-right: 32px">
    <v-row justify="center">
      <v-menu
        bottom
        origin="center center"
        min-width="200px"
        transition="scale-transition"
        rounded
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn icon x-large v-on="on">
            <v-avatar color="brown" size="42">
              <img src="user.jpg" alt="John" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card width="350">
          <v-list-item-content class="justify-center">
            <h3 style="margin: 12px 0 12px 24px">User Profile</h3>
            <div style="display: flex; justify-content: flex-start">
              <div style="margin-left: 16px">
                <v-avatar size="72" color="brown">
                  <img src="user.jpg" alt="John" />
                </v-avatar>
              </div>
              <div
                style="
                  justify-items: center;
                  margin-left: 16px;
                  margin-top: 12px;
                "
              >
                <h3>Admin</h3>
                <p style="margin-top: 8px">
                  <i class="icon pi pi-envelope" style="margin-right: 6px" />{{
                    user.email
                  }}
                </p>
              </div>
            </div>
            <div class="mx-auto text-center">
              <v-divider class="my-3"></v-divider>
              <v-row style="justify-content: center">
                <v-col cols="8">
                  <v-btn outlined color="#ff9081" block dark @click="logout"
                    >Logout</v-btn
                  >
                </v-col>
              </v-row>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ProfilePopup',

  data: () => ({
    user: ''
  }),

  mounted() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  },

  methods: {
    resolveLetter() {
      let i = '';
      if (this.user) {
        if (this.user.firstname) {
          i += this.user.firstname[0];
        } else {
          i += this.user.username[0];
        }
      } else {
        i = '-';
      }
      return i.toUpperCase();
    },
    getUsername() {
      if (this.user) {
        let name = this.user.firstname;

        return name;
      } else {
        return '_';
      }
    },
    logout() {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_user_scopes');

      this.$router.push('/auth/sign-in');
    }
  }
};
</script>

<style lang="sass" scoped>
.profile-view
  width: 45px
  height: 45px
  display: flex
  align-items: center
  background: #f5c187
  justify-content: center

  &__letter
    font-size: 25px
    color: rgba(black, .7)
    font-family: google-sans, sans-serif

  &__image
    width: 80px
    height: 80px
    background: #f5c187
    margin: 0 auto
    border-radius: 40px !important
    display: flex
    justify-content: center
    align-items: center

  &__popup
    width: 290px
    height: 220px
    padding: 15px
    display: flex
    text-align: center
    flex-direction: column

    &__actions
      margin-top: 10px
      display: flex

#display-name
  margin: 0
  font-size: 16px
  font-weight: bold

#username
  margin: 0
</style>

<!--  <v-menu offset-x>-->
<!--    <template v-slot:activator="{ on, attrs }">-->
<!--      <v-card class="profile-view" elevation="5" v-bind="attrs" v-on="on">-->
<!--        <div class="profile-view__letter">{{ resolveLetter() }}</div>-->
<!--      </v-card>-->
<!--    </template>-->

<!--    <v-card class="profile-view__popup">-->
<!--      <div class="profile-view__image">-->
<!--        <div class="profile-view__letter">{{ resolveLetter() }}</div>-->
<!--      </div>-->

<!--      <v-spacer />-->
<!--      <p id="display-name">{{ getUsername() }}</p>-->
<!--      <p id="username">{{ this.user.email || 'Email' }}</p>-->

<!--      <v-spacer />-->
<!--      <v-divider style="margin: 0" />-->

<!--      &lt;!&ndash;      <div class="profile-view__popup__actions">&ndash;&gt;-->
<!--      &lt;!&ndash;        &lt;!&ndash;        <v-btn elevation="0" outlined color="primary">Edit</v-btn>&ndash;&gt;&ndash;&gt;-->
<!--      &lt;!&ndash;        <v-spacer />&ndash;&gt;-->
<!--      &lt;!&ndash;        <v-btn elevation="0" color="black" dark @click="logout">Logout</v-btn>&ndash;&gt;-->
<!--      &lt;!&ndash;      </div>&ndash;&gt;-->
<!--    </v-card>-->
<!--  </v-menu>-->
