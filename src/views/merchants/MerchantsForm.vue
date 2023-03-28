<template>
  <SimpleForm
    :is-edit="isEdit"
    :disabled="disabled"
    :onSubmit="submit"
    @done="$router.back()"
  >
    <p class="span-2 form__title">
      {{ isEdit ? 'Update Merchant' : 'Add New Merchant' }}
    </p>

    <v-img
      v-if="profileImageObjectURL"
      contain
      max-height="300"
      class="span-2 mb-4"
      :src="profileImageObjectURL"
    ></v-img>

    <v-file-input
      v-model="profileImage"
      accept="image/*"
      :rules="[required('Profile Image must be provided')]"
      class="span-2"
      label="Profile Image"
      outlined
    ></v-file-input>

    <v-text-field
      v-model="merchant.firstName"
      :rules="[required('First Name must be provided')]"
      class="span-2"
      label="First Name"
      outlined
    />

    <v-text-field
      v-model="merchant.surName"
      :rules="[required('Surname must be provided')]"
      class="span-2"
      label="Surname"
      outlined
    />

    <v-text-field
      v-model="merchant.username"
      :rules="[required('Username must be provided')]"
      class="span-2"
      label="Username"
      outlined
    />

    <v-text-field
      v-model="merchant.email"
      :rules="[
        required('Email must be provided'),
        email('Email must be valid')
      ]"
      class="span-2"
      label="Email"
      type="email"
      outlined
    />

    <v-text-field
      v-model="merchant.password"
      :rules="[required('Password must be provided')]"
      class="span-2"
      label="Password"
      type="password"
      outlined
    />

    <v-text-field
      v-model="merchant.restaurantName"
      :rules="[required('Full name must be provided')]"
      class="span-2"
      label="Full Name"
      outlined
    />

    <v-text-field
      v-model="merchant.phoneNumber"
      :rules="[required('Contact Number must be provided')]"
      type="number"
      class="span-2"
      label="Contact Number"
      outlined
    />

    <v-textarea
      v-model="merchant.description"
      :rules="[required('Description Number must be provided')]"
      class="span-2"
      label="Description"
      outlined
    />

    <!-- <gmap-map
      class="span-2"
      :center="center"
      :zoom="zoom"
      @click="onMapClick"
      @loaded="onMapLoaded"
      ref="map"
    >
    </gmap-map> -->

    <!-- <button v-if="mapReady" @click="getSelectedLocation">
      Get Selected Location
    </button> -->

    <v-combobox
      v-model="merchant.tags"
      :items="['Tag 1', 'Tag 2', 'Tag 3']"
      :rules="[required('Tags must be provided')]"
      class="span-2"
      label="Tags"
      outlined
      autocomplete
      multiple
      small-chips
      deletable-chips
    ></v-combobox>

    <v-select
      v-model="merchant.dietaryRestrictions"
      :items="['Dietary 1', 'Dietary 2', 'Dietary 3']"
      :rules="[required('Dietary Restrictions must be provided')]"
      class="span-2"
      label="Dietary Restrictions"
      outlined
      multiple
    ></v-select>

    <v-select
      v-model="merchant.culinaryOptions"
      :items="['Culinary 1', 'Culinary 2', 'Culinary 3']"
      :rules="[required('Culinary Options must be provided')]"
      class="span-2"
      label="Culinary Options"
      outlined
      multiple
    ></v-select>

    <v-row no-gutters class="span-2 d-flex justify-space-between">
      <v-checkbox
        v-model="merchant.status"
        label="Is MerchantActive"
        outlined
      ></v-checkbox>

      <v-checkbox
        v-model="merchant.isSponsored"
        label="Is Sponsored"
        outlined
      ></v-checkbox>
    </v-row>

    <v-carousel
      v-if="media.length > 0"
      height="300"
      class="span-2 mb-4"
      hide-delimiters
      show-arrows-on-hover
    >
      <v-carousel-item
        contain
        v-for="(image, index) in mediaObjectURL"
        :key="index"
        :src="image"
        style="object-fit: cover"
      ></v-carousel-item>
    </v-carousel>

    <v-file-input
      v-model="media"
      accept="image/*"
      :rules="[required('Images must be provided')]"
      class="span-2"
      label="Images"
      outlined
      multiple
    ></v-file-input>

    <v-file-input
      v-model="menu"
      :rules="[required('Menu File must be provided')]"
      class="span-2"
      label="Menu File"
      outlined
      multiple
    ></v-file-input>

    <loading-dialog v-model="loading" message="Fetching User Data" />
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import { UsersService } from '@/services/user-service';
import { UploadImageService } from '@/services/upload-image-service';
import LoadingDialog from '../../components/LoadingDialog';
import { required, email } from '@/utils/validators';

export default {
  name: 'Form',
  components: { LoadingDialog, SimpleForm },

  data: () => ({
    isEdit: false,
    loading: false,
    users_service: new UsersService(),
    upload_image_service: new UploadImageService(),
    // center: { lat: 0, lng: 0 },
    // zoom: 10,
    // mapReady: false,

    // only for edit
    disabled: false,

    profileImage: null,
    menu: null,
    media: [],
    tags: [],
    dietaryRestrictions: [],
    culinaryOtions: [],

    merchant: {
      role: 'MERCHANT',
      firstName: '',
      surName: '',
      username: '',
      email: '',
      password: '',
      profileImage: '',
      restaurantName: '',
      phoneNumber: '',
      description: '',
      tags: [],
      dietaryRestrictions: [],
      culinaryOptions: [],
      status: false,
      isSponsored: false,
      menu: [],
      media: []
    }
  }),

  mounted() {
    this.loadUser();
  },

  computed: {
    profileImageObjectURL() {
      return this.profileImage ? URL.createObjectURL(this.profileImage) : '';
    },

    mediaObjectURL() {
      return this.media.map((image) => URL.createObjectURL(image));
    }
  },

  methods: {
    required,
    email,

    // onMapClick(event) {
    //   this.center = {
    //     lat: event.latLng.lat(),
    //     lng: event.latLng.lng()
    //   };
    // },
    // onMapLoaded() {
    //   this.mapReady = true;
    // },
    // getSelectedLocation() {
    //   const latLng = this.$refs.map.getCenter();
    //   const selectedLocation = {
    //     lat: latLng.lat(),
    //     lng: latLng.lng()
    //   };
    //   console.log(selectedLocation); // Do something with the selected location
    // },

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

          if (this.profileImage) {
            const formData = new FormData();
            formData.append('media', this.profileImage);

            const response = await this.$axios.post('/single-file', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            this.merchant.profileImage = response.data;
            console.log(this.merchant.profileImage, 'profileImage');
          }

          if (this.media.length > 0) {
            await Promise.all(
              this.media.map(async (image, i) => {
                console.log(i, 'index');
                const formData = new FormData();
                formData.append('media', image);

                const response = await this.$axios.post(
                  '/single-file',
                  formData,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }
                );

                this.merchant.media.push(response.data);
              })
            );
          }

          if (this.menu.length > 0) {
            await Promise.all(
              this.menu.map(async (image) => {
                const formData = new FormData();
                formData.append('media', image);

                const response = await this.$axios.post(
                  '/single-file',
                  formData,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  }
                );

                this.merchant.menu.push(response.data);
              })
            );
          }

          if (this.merchant && this.merchant.status === true) {
            this.merchant.status = 'ACTIVE';
          } else {
            this.merchant.status = 'PENDING';
          }
          console.log(this.merchant);

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
