<template>
  <SimpleForm
    :is-edit="isEdit"
    :disabled="disabled"
    :onSubmit="submit"
    @done="$router.back()"
  >
    <p class="span-2 form__title">
      {{ isEdit ? 'Update Admin' : 'Add New Admin' }}
    </p>

    <v-text-field
      v-model="admin.firstname"
      :rules="[required('First name must be provided')]"
      class="span-2"
      label="First Name"
      outlined
    />

    <v-text-field
      v-model="admin.surname"
      :rules="[required('Surname name must be provided')]"
      class="span-2"
      label="Surname"
      outlined
    />

    <v-text-field
      v-model="admin.email"
      :rules="[required('Email must be provided')]"
      class="span-2"
      label="Email"
      outlined
    />

    <v-text-field
      v-if="!isEdit"
      v-model="admin.username"
      :rules="[required('Username must be provided')]"
      class="span-2"
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

    <v-treeview
      v-model="admin.scopes"
      :items="adminScopes"
      selectable
      style="text-align: left; margin-top: -15px"
      class="span-2"
    />

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
    adminScopes: [
      {
        id: 'admins',
        name: 'Admins',
        children: [
          { id: 'admins:new', name: 'Create Admins' },
          { id: 'admins:view', name: 'View Admins' },
          { id: 'admins:edit', name: 'Edit Admins' },
          { id: 'admins:delete', name: 'Delete Admins' }
        ]
      },
      {
        id: 'users',
        name: 'Users',
        children: [
          { id: 'users:view', name: 'View Users' },
          { id: 'users:delete', name: 'Delete Users' }
        ]
      },
      {
        id: 'merchants',
        name: 'Merchants',
        children: [
          { id: 'merchants:new', name: 'Create Merchants' },
          { id: 'merchants:edit', name: 'Edit Merchants' },
          { id: 'merchants:view', name: 'View Merchants' },
          { id: 'merchants:delete', name: 'Delete Merchants' }
        ]
      }
      // {
      //   id: 'events',
      //   name: 'Events',
      //   children: [
      //     { id: 'events:new', name: 'Create Events' },
      //     { id: 'events:view', name: 'View Events' },
      //     { id: 'events:edit', name: 'Edit Events' },
      //     { id: 'events:delete', name: 'Delete Events' }
      //   ]
      // }
      // {
      //   id: 'frequencies',
      //   name: 'Frequency',
      //   children: [
      //     { id: 'frequency:new', name: 'Create Frequency' },
      //     { id: 'frequency:view', name: 'View Frequency' },
      //     { id: 'frequency:edit', name: 'Edit Frequency' },
      //     { id: 'frequency:delete', name: 'Delete Frequency' }
      //   ]
      // },
      // {
      //   id: 'affirmations',
      //   name: 'Affirmations',
      //   children: [
      //     { id: 'affirmations:new', name: 'Create Affirmations' },
      //     { id: 'affirmations:view', name: 'View Affirmations' },
      //     { id: 'affirmations:edit', name: 'Edit Affirmations' },
      //     { id: 'affirmations:delete', name: 'Delete Affirmations' }
      //   ]
      // },
      // {
      //   id: 'meditations',
      //   name: 'Meditations',
      //   children: [
      //     { id: 'meditations:new', name: 'Create Meditations' },
      //     { id: 'meditations:view', name: 'View Meditations' },
      //     { id: 'meditations:edit', name: 'Edit Meditations' },
      //     { id: 'meditations:delete', name: 'Delete Meditations' }
      //   ]
      // },

      // {
      //   id: 'resources',
      //   name: 'Video Resources',
      //   children: [
      //     { id: 'resources:new', name: 'Create Video Resources' },
      //     { id: 'resources:view', name: 'View Video Resources' },
      //     { id: 'resources:edit', name: 'Edit Video Resources' },
      //     { id: 'resources:delete', name: 'Delete Video Resources' }
      //   ]
      // },
      // {
      //   id: 'courses',
      //   name: 'Courses',
      //   children: [
      //     { id: 'courses:new', name: 'Create Courses' },
      //     { id: 'courses:view', name: 'View Courses' },
      //     { id: 'courses:edit', name: 'Edit Courses' },
      //     { id: 'courses:delete', name: 'Delete Courses' }
      //   ]
      // },
      // {
      //   id: 'modules',
      //   name: 'Modules',
      //   children: [
      //     { id: 'modules:new', name: 'Create Modules' },
      //     { id: 'modules:view', name: 'View Modules' },
      //     { id: 'modules:edit', name: 'Edit Modules' },
      //     { id: 'modules:delete', name: 'Delete Modules' }
      //   ]
      // },
      // {
      //   id: 'chapters',
      //   name: 'Chapters',
      //   children: [
      //     { id: 'chapters:new', name: 'Create Chapters' },
      //     { id: 'chapters:view', name: 'View Chapters' },
      //     { id: 'chapters:edit', name: 'Edit Chapters' },
      //     { id: 'chapters:delete', name: 'Delete Chapters' }
      //   ]
      // },
      // {
      //   id: 'lectures',
      //   name: 'Lectures',
      //   children: [
      //     { id: 'lectures:new', name: 'Create Lectures' },
      //     { id: 'lectures:view', name: 'View Lectures' },
      //     { id: 'lectures:edit', name: 'Edit Lectures' },
      //     { id: 'lectures:delete', name: 'Delete Lectures' }
      //   ]
      // },
      // {
      //   id: 'testimonials',
      //   name: 'Testimonials',
      //   children: [
      //     { id: 'testimonial:add', name: 'Add Testimonial' },
      //     { id: 'testimonial:view', name: 'View Testimonial' },
      //     { id: 'testimonial:edit', name: 'Edit Testimonial' },
      //     { id: 'testimonial:delete', name: 'Delete Testimonial' }
      //   ]
      // },
      // {
      //   id: 'faq',
      //   name: 'FAQs',
      //   children: [
      //     { id: 'faq:add', name: 'Add FAQ' },
      //     { id: 'faq:view', name: 'View FAQ' },
      //     { id: 'faq:edit', name: 'Edit FAQ' },
      //     { id: 'faq:delete', name: 'Delete FAQ' }
      //   ]
      // },
      // {
      //   id: 'terms&conditions',
      //   name: 'Terms & Conditions',
      //   children: [
      //     { id: 'term:add', name: 'Add Terms & Condition' },
      //     { id: 'term:view', name: 'View Terms & Condition' },
      //     { id: 'term:edit', name: 'Edit Terms & Condition' },
      //     { id: 'term:delete', name: 'Delete Terms & Condition' }
      //   ]
      // },
      // {
      //   id: 'settings',
      //   name: 'Settings',
      //   children: [
      //     { id: 'settings:view', name: 'View Setting' },
      //     { id: 'settings:edit', name: 'Edit Setting' }
      //   ]
      // }
    ],
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
