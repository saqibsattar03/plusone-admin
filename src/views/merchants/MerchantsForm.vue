<template>
  <SimpleForm
    :is-edit="isEdit"
    :disabled="disabled"
    :onSubmit="submit"
    @done="$router.back()"
  >
    <v-row class="pa-0 d-flex justify-end span-2" no-gutters>
      <v-btn color="primary" @click="$router.go(-1)">
        <v-icon class="v-btn__pre-icon" small>mdi-arrow-left</v-icon>&nbsp;
        Back</v-btn
      >
    </v-row>

    <p class="span-2 form__title">
      {{ isEdit ? 'Update Merchant' : 'Add New Merchant' }}
    </p>

    <v-img
      v-if="profileImageObjectURL && !isEdit"
      contain
      max-height="300"
      class="span-2 mb-4"
      :src="profileImageObjectURL"
    ></v-img>

    <v-img
      v-if="merchant.profileImage && isEdit"
      contain
      max-height="300"
      class="span-2 mb-4"
      :src="
        profileImageObjectURL ? profileImageObjectURL : merchant.profileImage
      "
    ></v-img>

    <v-file-input
      v-model="profileImage"
      accept="image/*"
      :rules="!isEdit ? [required(`Profile Image must be provided`)] : []"
      class="span-2"
      :placeholder="isEdit ? 'Update Profile Image' : 'Add Profile Image'"
      outlined
    >
      <template v-slot:selection="{ index, text }">
        <v-chip v-if="index < 2" color="primary" dark label small>
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>

    <v-text-field
      v-if="!isEdit"
      v-model="merchant.firstname"
      :rules="[required('First Name must be provided')]"
      class="span-2"
      label="First Name"
      outlined
    />

    <v-text-field
      v-if="!isEdit"
      v-model="merchant.surname"
      :rules="[required('Surname must be provided')]"
      class="span-2"
      label="Surname"
      outlined
    />

    <v-text-field
      v-if="!isEdit"
      v-model="merchant.username"
      :rules="[required('Username must be provided')]"
      class="span-2"
      label="Username"
      outlined
    />

    <v-text-field
      v-if="!isEdit"
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
      v-if="!isEdit"
      v-model="merchant.password"
      :rules="[required('Password must be provided')]"
      class="span-2"
      label="Password"
      type="password"
      outlined
    />

    <v-text-field
      v-model="merchant.restaurantName"
      :rules="[required('Restaurant name must be provided')]"
      class="span-2"
      label="Restaurant Name"
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

    <l-map
      style="height: 250px; margin-bottom: 40px; z-index: 1"
      class="span-2"
      ref="map"
      :zoom="zoom"
      :center="center"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker :lat-lng="marker"></l-marker>
    </l-map>

    <v-combobox
      v-model="merchant.tags"
      :items="tags"
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
      :items="dietaryRestrictions"
      :rules="[required('Dietary Restrictions must be provided')]"
      class="span-2"
      label="Dietary Restrictions"
      outlined
      multiple
    ></v-select>

    <v-select
      v-model="merchant.culinaryOptions"
      :items="culinaryOptions"
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
      v-if="media.length > 0 && !isEdit"
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

    <v-carousel
      v-if="merchant.media.length > 0 && isEdit"
      height="300"
      class="span-2 mb-4"
      hide-delimiters
      show-arrows-on-hover
    >
      <v-carousel-item
        contain
        v-for="(image, index) in merchant.media"
        :key="index"
        :src="image"
        style="object-fit: cover"
      ></v-carousel-item>
    </v-carousel>

    <v-file-input
      v-model="media"
      accept="image/*"
      :rules="!isEdit ? [required(`Images must be provided`)] : []"
      class="span-2"
      label="Images"
      outlined
      multiple
    >
      <template v-slot:selection="{ index, text }">
        <v-chip v-if="index < 2" color="primary" dark label small>
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>

    <v-file-input
      v-model="menu"
      :rules="!isEdit ? [required(`Menu File must be provided`)] : []"
      class="span-2"
      label="Menu File"
      outlined
      multiple
      accept=".jpg,.jpeg,.png"
    >
      <template v-slot:selection="{ index, text }">
        <v-chip v-if="index < 2" color="primary" dark label small>
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>

    <loading-dialog v-model="loading" message="Fetching Merchant Data" />
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import { MerchantsService } from '../../services/merchant-service';
import { UploadImageService } from '@/services/upload-image-service';
import LoadingDialog from '../../components/LoadingDialog';
import { required, email } from '@/utils/validators';

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'Form',
  components: { LoadingDialog, SimpleForm, LMap, LTileLayer, LMarker },

  data: () => ({
    isEdit: false,
    loading: false,
    merchantsService: new MerchantsService(),
    upload_image_service: new UploadImageService(),

    zoom: 13,
    center: [51.505, -0.09],
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    marker: [51.505, -0.09],

    // only for edit
    disabled: false,

    oldProfileImage: null,
    oldMenu: [],
    oldMedia: [],

    profileImage: null,
    menu: [],
    media: [],
    tags: ['Halal', 'Late Night'],
    dietaryRestrictions: [
      'Vegan',
      'Vegetarian',
      'Halal',
      'Kosher',
      'Gluten Free',
      'Dairy free',
      'Keto',
      'Pescatarian',
      'Paleo'
    ],
    culinaryOptions: [
      'Italian',
      'Mexican',
      'Japanese',
      'Chinese',
      'Indian',
      'Thai',
      'Turkish',
      'Indonesian',
      'American',
      'Korean',
      'Greek',
      'Lebanese',
      'French',
      'Caribbean',
      'Vietnamese'
    ],

    merchant: {
      role: 'MERCHANT',
      username: '',
      firstname: '',
      surname: '',
      email: '',
      status: '',
      password: '',
      profileImage: '',
      restaurantName: '',
      phoneNumber: '',
      description: '',
      tags: [],
      dietaryRestrictions: [],
      culinaryOptions: [],
      isSponsored: false,
      menu: [],
      media: [],
      location: {
        type: 'Point',
        coordinates: []
      }
    }
  }),

  mounted() {
    this.loadMerchant();
  },

  computed: {
    profileImageObjectURL() {
      return this.profileImage ? URL.createObjectURL(this.profileImage) : '';
    },

    mediaObjectURL() {
      return this.media.length > 0
        ? this.media.map((image) => URL.createObjectURL(image))
        : [];
    }
  },

  methods: {
    required,
    email,

    async getUserLocation() {
      try {
        const position = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.center = [lat, lng];
        this.marker = [lat, lng];
      } catch (error) {
        console.error('Error getting user location:', error);
      }
    },
    centerUpdate(newCenter) {
      this.marker = newCenter;
    },
    zoomUpdate(newZoom) {
      this.zoom = newZoom;
    },

    async loadMerchant() {
      if (!this.$route.query.id) {
        this.getUserLocation();
        return;
      }
      this.isEdit = true;
      this.loading = true;
      this.merchant = await this.merchantsService.fetchOne(
        this.$route.query.id
      );

      this.center = [
        this.merchant.location.coordinates[1],
        this.merchant.location.coordinates[0]
      ];

      this.marker = [
        this.merchant.location.coordinates[1],
        this.merchant.location.coordinates[0]
      ];

      this.oldProfileImage = this.merchant.profileImage;
      this.oldMenu = this.merchant.menu;
      this.oldMedia = this.merchant.media;

      this.merchant.media = [];
      this.merchant.menu = [];

      await this.$axios
        .get(`/singe-file?file=${this.merchant.profileImage}`)
        .then((response) => {
          this.merchant.profileImage = response.data;
        });

      await Promise.all(
        this.oldMenu.map(async (menu) => {
          await this.$axios.get(`/singe-file?file=${menu}`).then((response) => {
            menu = response.data;
            this.merchant.menu.push(menu);
          });
        })
      );

      await Promise.all(
        this.oldMedia.map(async (media) => {
          await this.$axios
            .get(`/singe-file?file=${media}`)
            .then((response) => {
              media = response.data;
              this.merchant.media.push(media);
            });
        })
      );

      this.loading = false;
    },
    async submit(context) {
      if (this.isEdit) {
        context.changeLoadingMessage('Updating Merchant');

        try {
          // updating merchant
          if (this.profileImage) {
            const formData = new FormData();
            formData.append('media', this.profileImage);

            const response = await this.$axios.post('/single-file', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            this.merchant.profileImage = response.data;
          }

          if (this.menu.length > 0) {
            this.merchant.menu = [];

            await Promise.all(
              this.menu.map(async (menu) => {
                const formData = new FormData();
                formData.append('media', menu);

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

          if (this.media.length > 0) {
            this.merchant.media = [];

            await Promise.all(
              this.media.map(async (media) => {
                const formData = new FormData();
                formData.append('media', media);

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

          // if (this.oldProfileImage) {
          //   try {
          //     await this.$axios.delete(
          //       `/remove-file?media=${this.oldProfileImage}`
          //     );
          //   } catch (e) {
          //     console.log(e.response);
          //   }
          // }

          // if (this.oldMenu.length > 0) {
          //   try {
          //     await Promise.all(
          //       this.oldMenu.map(async (menu) => {
          //         await this.$axios.delete(`/remove-file?media=${menu}`);
          //       })
          //     );
          //   } catch (e) {
          //     console.log(e.response);
          //   }
          // }

          // if (this.oldMedia.length > 0) {
          //   try {
          //     await Promise.all(
          //       this.oldMedia.map(async (media) => {
          //         await this.$axios.delete(`/remove-file?media=${media}`);
          //       })
          //     );
          //   } catch (e) {
          //     console.log(e.response);
          //   }
          // }

          this.merchant.location = {
            type: 'Point',
            coordinates: [
              this.marker.lng ? this.marker.lng : this.center[1],
              this.marker.lat ? this.marker.lat : this.center[0]
            ]
          };

          console.log(this.merchant);
          this.merchantsService.update(this.merchant);
          return true;
        } catch (e) {
          context.reportError({
            title: 'Error while updating Merchant',
            description: e.response
              ? e.response.data.message
              : 'Something went wrong!'
          });
          return false;
        }
      } else {
        context.changeLoadingMessage('Creating Merchant');
        try {
          // creating merchant

          if (this.profileImage) {
            const formData = new FormData();
            formData.append('media', this.profileImage);

            const response = await this.$axios.post('/single-file', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            this.merchant.profileImage = response.data;
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

          if (
            this.merchant &&
            this.merchant.status &&
            this.merchant.status === true
          ) {
            this.merchant.status = 'ACTIVE';
          } else {
            this.merchant.status = 'PENDING';
          }

          this.merchant.location = {
            type: 'Point',
            coordinates: [
              this.marker.lng ? this.marker.lng : this.center[1],
              this.marker.lat ? this.marker.lat : this.center[0]
            ]
          };

          await this.merchantsService.create(this.merchant);
          return true;
        } catch (e) {
          context.reportError({
            title: 'Error while creating Merchant',
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
