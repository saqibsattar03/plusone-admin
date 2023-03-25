<template>
  <SimpleForm :is-edit="isEdit" :disabled="disabled" :onSubmit="submit" @done="$router.back()">
    <p class="span-2 form__title">
      {{ isEdit ? 'Update User' : 'Add New User' }}
    </p>

    <v-text-field
      v-model="user.name"
      :rules="[required('Full name must be provided')]"
      class="span-2"
      label="Full Name"
      outlined
    />

    <v-text-field
      v-if="this.isEdit == false"
      v-model="user.email"
      :rules="[required('Email must be provided')]"
      class="span-2"
      label="Email"
      outlined
    />

    <!-- <v-text-field
      v-if="this.isEdit == true"
      v-model="password.old"
      class="span-2"
      label="Old Password(Optional)"
      outlined
    ></v-text-field> -->

    <!-- <v-text-field
      v-if="this.isEdit == true"
      v-model="password.new"
      class="span-2"
      label="New Password(Optional)"
      outlined
    ></v-text-field> -->

    <v-text-field
      v-if="this.isEdit == false"
      v-model="user.password"
      class="span-2"
      :rules="[required('Password must be provided')]"
      label="Password"
      outlined
    ></v-text-field>

    <loading-dialog v-model="loading" message="Fetching User Data" />
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import { UsersService } from '@/services/user-service';
import LoadingDialog from '../../components/LoadingDialog';
import { required } from '@/utils/validators';

export default {
  name: 'Form',
  components: { LoadingDialog, SimpleForm },

  data: () => ({
    isEdit: false,
    loading: false,
    users_service: new UsersService(),
    // only for edit
    disabled: false,
    user: {
      role: 'User',
      loginVia: 'Email',
      name: '',
      email: '',
      password: ''
    },
    password: {
      new: '',
      old: ''
    }
  }),

  mounted() {
    this.loadUser();
  },

  methods: {
    required,

    async loadUser() {
      if (!this.$route.query.id) return;
      this.isEdit = true;
      this.loading = true;
      this.user = await this.users_service.fetchOne(this.$route.query.id);
      this.loading = false;
    },
    async submit(context) {
      if (this.isEdit) {
        context.changeLoadingMessage('Updating User');

        try {
          this.users_service.update(this.user);
          return true;
        } catch (e) {
          context.reportError({
            title: 'Error while updating User',
            description: e.response
              ? e.response.data.message
              : 'Something went wrong!'
          });
          return false;
        }

        // if (!this.password.old) {
        //   try {
        //     this.users_service.update(this.user);
        //     return true;
        //   } catch (e) {
        //     context.reportError({
        //       title: 'Error while updating User',
        //       description: e.response
        //         ? e.response.data.message
        //         : 'Something went wrong!'
        //     });
        //     return false;
        //   }
        // } else {
        //   try {
        //     await this.$axios
        //       .patch(`/persons/update-password/${this.$route.query.id}`, {
        //         oldPassword: this.password.old,
        //         newPassword: this.password.new
        //       })
        //       .then(() => {
        //         this.users_service.update(this.user);
        //       });
        //     return true;
        //   } catch (e) {
        //     context.reportError({
        //       title: 'Error while updating User',
        //       description: e.response
        //         ? e.response.data.message
        //         : 'Something went wrong!'
        //     });
        //     return false;
        //   }
        // }
      } else {
        context.changeLoadingMessage('Creating User');
        try {
          // creating user
          await this.users_service.create(this.user);
          return true;
        } catch (e) {
          context.reportError({
            title: 'Error while creating User',
            description: e.response
              ? e.response.data.message
              : 'Something went wrong!'
          });

          return false;
        }
      }
    }
  }
};
</script>

<style scoped>
p {
  font-weight: bold;
  text-align: left;
}
</style>
