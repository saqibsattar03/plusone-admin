<template>
  <div id="background">
    <v-card
      class="sign-in"
      elevation="10"
      :class="[$vuetify.breakpoint.smAndDown ? 'mx-4' : '']"
    >
      <img
        src="../../assets/plus-one-logo.svg"
        alt="Logo"
        class="sign-in__logo"
      />

      <h1 class="sign-in__title">Authenticate yourself</h1>
      <p class="sign-in__message">
        You need an admin account to access the content ahead, if you do not
        have an account or have forgotten your password then you can contact the
        support regarding your issue
      </p>
      <v-form ref="form">
        <v-text-field
          v-model="username"
          label="Your Email"
          outlined
          :rules="[required(), email()]"
        />
        <v-text-field
          id="password"
          class="mb-10"
          v-model="password"
          :rules="[required('Do not leave this field empty')]"
          hide-details="auto"
          @keypress.enter="signIn"
          label="Your Password"
          :type="showPassword ? 'text' : 'password'"
          outlined
          @click:append="showPassword = !showPassword"
          :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        />

        <v-btn
          @click="signIn"
          color="primary"
          dark
          elevation="0"
          width="100%"
          height="45px"
        >
          Authenticate
          <v-icon small style="margin-left: 5px">mdi-arrow-right</v-icon>
        </v-btn>
      </v-form>
    </v-card>
    <loading-dialog v-model="loading" message="Please wait..." />
    <error-dialog v-model="error" :error="errorVal" />
  </div>
</template>

<script>
import { required, email } from '@/utils/validators';
import LoadingDialog from '../../components/LoadingDialog';
import ErrorDialog from '../../components/ErrorDialog';

export default {
  name: 'SignIn',
  components: { ErrorDialog, LoadingDialog },

  data: () => ({
    error: false,
    errorVal: {},
    loading: false,
    username: '',
    password: '',
    showPassword: false
  }),

  methods: {
    email,
    required,
    async signIn() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        await this.$axios
          .post('/auth/sign-in', {
            email: this.username,
            password: this.password
          })
          .then(async (res) => {
            localStorage.setItem('auth_token', res.data.access_token);
            await this.$axios.get('/auth/person').then(async (res) => {
              localStorage.setItem('user', JSON.stringify(res.data));
              await this.$router.push('/').then(() => {
                this.$router.go();
              });
              this.loading = false;
            });
          })
          .catch((e) => {
            console.log(e);
            this.error = true;
            this.errorVal = {
              title: 'Sign In Failed',
              description: 'Email or Password incorrect!'
            };
            this.loading = false;
          });

        this.loading = false;
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.sign-in
  width: 448px
  padding: 20px 40px 40px 40px
  background: white
  text-align: center
  border-radius: 8px

  &__header
    display: grid
    grid-column-gap: 20px
    grid-template-columns: calc(30% - 20px) 70%

  &__logo
    width: 50%
    margin-bottom: 20px

  &__title
    color: black
    font-size: 24px
    margin-bottom: 10px
    font-weight: normal
    font-family: google-sans, sans-serif

  &__message
    font-size: 13px
    margin-bottom: 40px


#background
  height: 100vh
  display: flex
  align-items: center
  justify-content: center
  background: #020819
  //background: #1833A9
</style>

<style>
html {
  overflow-y: auto;
}

.f__link {
  margin: 10px 0 !important;
  text-align: right;
  cursor: pointer;
  color: #020819;
}
</style>
