<template>
  <SimpleForm
    :is-edit="isEdit"
    :disabled="disabled"
    :onSubmit="submit"
    @done="$router.back()"
  >
    <v-row class="span-2" no-gutters>
      <v-btn @click="$router.go(-1)" elevation="0">
        <v-icon>mdi-arrow-left</v-icon></v-btn
      >

      <p class="form__title" style="width: 90%">
        {{ isEdit ? 'Update Merchant' : 'Add New Merchant' }}
      </p>
    </v-row>

    <v-card class="mx-auto span-1 mb-16" height="300" width="300">
      <v-img
        v-if="merchant.profileImage"
        :src="merchant.profileImage"
        alt="Profile Image"
        height="300"
        width="300"
        class="mx-auto"
      ></v-img>
      <div
        v-else
        class="d-flex align-center justify-center"
        id="profileImage"
        style="
          width: 100%;
          height: 100%;
          background-color: #f5f5f5;
          border-radius: 4px;
        "
      >
        <span class="text--disabled">No image selected</span>
      </div>
      <v-card-text class="text-center">
        <v-btn small color="primary" @click="onButtonClick">{{
          merchant.profileImage ? 'Change Image' : 'Select Image'
        }}</v-btn>
        <input
          type="file"
          ref="fileInput"
          @change="onFileSelected"
          style="display: none"
        />
      </v-card-text>
    </v-card>

    <v-col>
      <v-text-field
        v-model="merchant.restaurantName"
        :rules="[required('Restaurant name must be provided')]"
        label="Restaurant Name"
        outlined
        color="#111827"
      />

      <v-text-field
        v-if="!isEdit"
        v-model="merchant.email"
        :rules="[
          required('Email must be provided'),
          email('Email must be valid')
        ]"
        label="Email"
        type="email"
        outlined
        color="#111827"
      />

      <v-text-field
        v-if="!isEdit"
        v-model="merchant.password"
        :rules="[required('Password must be provided')]"
        label="Password"
        type="password"
        outlined
        color="#111827"
      />

      <v-text-field
        v-model="merchant.phoneNumber"
        :rules="[required('Contact Number must be provided')]"
        type="number"
        label="Contact Number"
        outlined
        color="#111827"
      />
    </v-col>

    <v-textarea
      v-model="merchant.description"
      :rules="[required('Description  must be provided')]"
      class="span-2"
      label="Description"
      outlined
      color="#111827"
    />

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
      color="#111827"
    ></v-combobox>

    <v-select
      v-model="merchant.dietaryRestrictions"
      :items="dietaryRestrictions"
      :rules="[required('Dietary Restrictions must be provided')]"
      class="span-2"
      label="Dietary Restrictions"
      outlined
      multiple
      color="#111827"
    ></v-select>

    <v-select
      v-model="merchant.culinaryOptions"
      :items="culinaryOptions"
      :rules="[required('Culinary Options must be provided')]"
      class="span-2"
      label="Culinary Options"
      outlined
      multiple
      color="#111827"
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
      :rules="
        !isEdit
          ? [
              required(`Restaurant gallery images must be provided`),
              requiredArray(`At least one image must be provided`)
            ]
          : []
      "
      class="span-2"
      label="Restaurant Gallery"
      outlined
      multiple
      color="#111827"
    >
      <template v-slot:selection="{ index, text }">
        <v-chip v-if="index < 2" color="primary" dark label small>
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>

    <v-file-input
      v-model="menu"
      :rules="
        !isEdit ? [required(`Restaurant Menu file must be provided`)] : []
      "
      class="span-2"
      label="Restaurant Menu"
      outlined
      multiple
      accept=".pdf"
      color="#111827"
    >
      <template v-slot:selection="{ index, text }">
        <v-chip v-if="index < 2" color="primary" dark label small>
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>

    <gmap-map
      style="height: 300px; margin-bottom: 20px"
      class="span-2"
      :center="center"
      :zoom="zoom"
    >
      <GmapMarker
        :position="center"
        :clickable="true"
        :draggable="true"
        @dragend="updateLocation"
      />
    </gmap-map>

    <loading-dialog v-model="loading" message="Fetching Merchant Data" />
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import { MerchantsService } from '../../services/merchant-service';
import LoadingDialog from '../../components/LoadingDialog';
import { required, email, requiredArray } from '@/utils/validators';

export default {
  name: 'Form',
  components: { LoadingDialog, SimpleForm },

  data: () => ({
    isEdit: false,
    loading: false,
    merchantsService: new MerchantsService(),

    center: { lat: 0, lng: 0 },
    zoom: 15,

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
      email: '',
      status: true,
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
      },
      locationName: ''
    }
  }),

  mounted() {
    this.loadMerchant();
  },

  computed: {
    mediaObjectURL() {
      return this.media.length > 0
        ? this.media.map((image) => URL.createObjectURL(image))
        : [];
    }
  },

  methods: {
    required,
    email,
    requiredArray,

    onButtonClick() {
      this.$refs.fileInput.click();
    },
    onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.profileImage = file;
        this.merchant.profileImage = URL.createObjectURL(file);
      }
    },

    getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
      }
    },

    updateLocation(event) {
      this.center = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
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

      if (
        this.merchant &&
        this.merchant.status &&
        this.merchant.status === 'PENDING'
      ) {
        this.merchant.status = false;
      } else {
        this.merchant.status = true;
      }

      this.center = {
        lat: this.merchant.location.coordinates[1],
        lng: this.merchant.location.coordinates[0]
      };

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
          } else {
            this.merchant.profileImage = this.oldProfileImage;
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
          } else {
            this.merchant.menu = this.oldMenu;
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
          } else {
            this.merchant.media = this.oldMedia;
          }

          this.merchant.location = {
            type: 'Point',
            coordinates: [this.center.lng, this.center.lat]
          };

          const axiosWithoutToken = this.$axios.create({
            headers: {
              'Content-Type': 'application/json'
            }
          });
          await axiosWithoutToken
            .get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.center.lat},${this.center.lng}&key=AIzaSyCqP_po3VVErDM_bd9sGVUmMNDJwEhHyUA`
            )
            .then((response) => {
              if (response.data.results.length > 0) {
                const locationName = response.data.results[0].formatted_address;
                this.merchant.locationName = locationName;
              } else {
                return 'Location not found';
              }
            })
            .catch((error) => {
              console.log(error, 'error');
            });

          if (
            this.merchant &&
            this.merchant.status &&
            this.merchant.status === true
          ) {
            this.merchant.status = 'ACTIVE';
          } else {
            this.merchant.status = 'PENDING';
          }

          await this.merchantsService.update(this.merchant);
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

          if (!this.merchant.profileImage) {
            document.getElementById('profileImage').style.border =
              '2px solid red';
            return false;
          }

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
            coordinates: [this.center.lng, this.center.lat]
          };

          const axiosWithoutToken = this.$axios.create({
            headers: {
              'Content-Type': 'application/json'
            }
          });
          await axiosWithoutToken
            .get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.center.lat},${this.center.lng}&key=AIzaSyCqP_po3VVErDM_bd9sGVUmMNDJwEhHyUA`
            )
            .then((response) => {
              if (response.data.results.length > 0) {
                const locationName = response.data.results[0].formatted_address;
                this.merchant.locationName = locationName;
              } else {
                return 'Location not found';
              }
            })
            .catch((error) => {
              console.log(error, 'error');
            });

          this.merchant.username = this.merchant.email;

          await this.merchantsService.create(this.merchant);
          return true;
        } catch (e) {
          context.reportError({
            title: 'Failed to create merchant',
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

.profile-image-preview,
.profile-image-placeholder {
  margin: 10px auto;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
}
.profile-image-placeholder {
  color: #333;
}
</style>
