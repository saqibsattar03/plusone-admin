<template>
  <SimpleForm
    :is-edit="isEdit"
    :disabled="disabled"
    :onSubmit="submit"
    @done="$router.back()"
  >
    <v-row class="span-2" no-gutters>
      <v-btn @click="$router.back()" elevation="0">
        <v-icon>mdi-arrow-left</v-icon></v-btn
      >

      <p class="form__title" style="width: 90%">
        {{ isEdit ? 'Update Admin' : 'Add New Admin' }}
      </p>
    </v-row>

    <v-text-field
      v-model="admin.firstname"
      :rules="[required('First name must be provided')]"
      class="span-1"
      label="First Name"
      outlined
    />

    <v-text-field
      v-model="admin.surname"
      :rules="[required('Surname name must be provided')]"
      class="span-1"
      label="Surname"
      outlined
    />

    <v-text-field
      v-model="admin.email"
      :rules="[required('Email must be provided')]"
      class="span-1"
      label="Email"
      outlined
    />

    <v-text-field
      v-if="!isEdit"
      v-model="admin.username"
      :rules="[required('Username must be provided')]"
      class="span-1"
      label="Username"
      outlined
    />

    <v-text-field
      v-if="!isEdit"
      v-model="admin.password"
      label="Password"
      outlined
      :type="showPassword ? 'text' : 'password'"
    />

    <v-text-field
      v-if="!isEdit"
      v-model="admin.passwordConfirm"
      :rules="[(v) => v === admin.password || 'Passwords does not match']"
      label="Confirm Password"
      outlined
      :type="showPassword ? 'text' : 'password'"
    />

    <v-checkbox
      v-if="!isEdit"
      class="mt-n5"
      v-model="showPassword"
      :label="`Show password`"
    ></v-checkbox>

    <v-text-field
      v-if="isEdit && loggedInUserId === admin._id"
      v-model="password.old"
      class="span-2"
      label="Old Password(Optional)"
      outlined
    ></v-text-field>

    <v-text-field
      v-if="isEdit && loggedInUserId === admin._id"
      v-model="password.new"
      class="span-2"
      label="New Password(Optional)"
      outlined
    ></v-text-field>

    <p class="span-2">Select Admin Scopes</p>

    <!-- <v-treeview
      v-model="admin.scopes"
      :items="adminScopes"
      selectable
      style="text-align: left; margin-top: -15px"
      class="span-2"
    /> -->

    <loading-dialog v-model="loading" message="Fetching Admin Data" />
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import { AdminsService } from '../../services/admin-service';
import LoadingDialog from '../../components/LoadingDialog';
import { required } from '../../utils/validators';

export default {
  name: 'AdminForm',
  components: { LoadingDialog, SimpleForm },

  data: () => ({
    isEdit: false,
    loading: false,
    admin_service: new AdminsService(),
    showPassword: '',
    // adminScopes: [
    //   {
    //     id: 'admins',
    //     name: 'Admins',
    //     children: [
    //       { id: 'admins:new', name: 'Create Admins' },
    //       { id: 'admins:view', name: 'View Admins' },
    //       { id: 'admins:edit', name: 'Edit Admins' },
    //       { id: 'admins:delete', name: 'Delete Admins' }
    //     ]
    //   },
    //   {
    //     id: 'users',
    //     name: 'Users',
    //     children: [
    //       { id: 'users:view', name: 'View Users' },
    //       { id: 'users:delete', name: 'Delete Users' }
    //     ]
    //   },
    //   {
    //     id: 'merchants',
    //     name: 'Merchants',
    //     children: [
    //       { id: 'merchants:new', name: 'Create Merchants' },
    //       { id: 'merchants:edit', name: 'Edit Merchants' },
    //       { id: 'merchants:view', name: 'View Merchants' },
    //       { id: 'merchants:delete', name: 'Delete Merchants' }
    //     ]
    //   },
    //   {
    //     id: 'vouchers',
    //     name: 'Vouchers',
    //     children: [
    //       { id: 'vouchers:new', name: 'Create Vouchers' },
    //       { id: 'vouchers:edit', name: 'Edit Vouchers' },
    //       { id: 'vouchers:view', name: 'View Vouchers' },
    //       { id: 'vouchers:delete', name: 'Delete Vouchers' }
    //     ]
    //   },
    //   {
    //     id: 'redeemVouchers',
    //     name: 'Redeem Vouchers',
    //     children: [{ id: 'redeem-vouchers:view', name: 'View Redeem Vouchers' }]
    //   },
    //   {
    //     id: 'quotes',
    //     name: 'Quotes',
    //     children: [
    //       { id: 'quotes:new', name: 'Create Quotes' },
    //       { id: 'quotes:edit', name: 'Edit Quotes' },
    //       { id: 'quotes:view', name: 'View Quotes' },
    //       { id: 'quotes:delete', name: 'Delete Quotes' }
    //     ]
    //   },
    //   {
    //     id: 'account',
    //     name: 'Account',
    //     children: [{ id: 'accounts:view', name: 'View Accounts' }]
    //   }
    // ],
    // only for edit
    showImageError: false,
    disabled: false,
    loggedInUserId: JSON.parse(localStorage.getItem('user'))._id,
    admin: {
      role: 'ADMIN',
      firstname: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      scopes: []
    },
    password: {
      old: '',
      new: ''
    }
  }),

  mounted() {
    this.loadAdmin();
  },

  methods: {
    required,

    async loadAdmin() {
      if (!this.$route.query.id) return;
      this.isEdit = true;
      this.loading = true;
      this.admin = await this.admin_service.fetchOne(this.$route.query.id);
      this.loading = false;
    },
    async submit(context) {
      if (this.isEdit) {
        context.changeLoadingMessage('Updating Admin');

        try {
          //updating admin
          // await this.admin_service.update(this.admin);

          if (!this.password.old) {
            try {
              this.admin_service.update(this.admin);
              return true;
            } catch (e) {
              context.reportError({
                title: 'Error while updating Admin',
                description: e.response
                  ? e.response.data.message
                  : 'Something went wrong!'
              });
              return false;
            }
          } else {
            try {
              await this.$axios
                .patch('/persons/update-password', {
                  email: this.admin.email,
                  oldPassword: this.password.old,
                  newPassword: this.password.new
                })
                .then(() => {
                  console.log(this.admin);
                  this.admin_service.update(this.admin);
                });

              return true;
            } catch (e) {
              context.reportError({
                title: 'Error while updating Admin',
                description: e.response
                  ? e.response.data.message
                  : 'Something went wrong!'
              });
              return false;
            }
          }
        } catch (e) {
          context.reportError({
            title: 'Error while updating Admin',
            description: e.response
              ? e.response.data.message
              : 'Something went wrong!'
          });
          return false;
        }
      } else {
        context.changeLoadingMessage('Creating Admin');
        try {
          // creating admin
          console.log(this.admin);
          await this.admin_service.create(this.admin);
          return true;
        } catch (e) {
          context.reportError({
            title: 'Error while creating Admin',
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
