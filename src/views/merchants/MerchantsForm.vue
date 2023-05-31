<template>
  <SimpleForm
    :is-edit="isEdit"
    :disabled="disabled"
    :onSubmit="submit"
    @done="$router.push('/merchants')"
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
      <v-card-text
        class="text-center"
        :style="imageError ? 'display: flex' : ''"
      >
        <p
          v-if="imageError"
          style="
            color: #ff5252;
            margin-top: -8px;
            font-size: 12px;
            line-height: 15px;
          "
        >
          For correct display, use a square image (1024x1024 pixels
          recommended).
        </p>

        <div>
          <v-btn small color="primary" @click="onButtonClick">{{
            merchant.profileImage ? 'Change Image' : 'Select Image'
          }}</v-btn>
          <input
            type="file"
            ref="fileInput"
            accept="image/*"
            @change="onFileSelected"
            hint="Max size: 2mb"
            style="display: none"
          />
        </div>
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
        :type="passwordFieldType"
        outlined
        color="#111827"
        :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="passwordVisible = !passwordVisible"
      />

      <v-text-field
        v-model="merchant.phoneNumber"
        :rules="[required('Contact Number must be provided')]"
        type="text"
        v-mask="'\+## ## ### ####'"
        mask-placeholder=" "
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
      :rules="[validate(merchant.tags, 'Tag')]"
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
      :rules="[validate(merchant.dietaryRestrictions, 'Dietary Restrictions')]"
      class="span-2"
      label="Dietary Restrictions"
      outlined
      small-chips
      deletable-chips
      multiple
      color="#111827"
    ></v-select>

    <v-select
      v-model="merchant.culinaryOptions"
      :items="culinaryOptions"
      :rules="[validate(merchant.culinaryOptions, 'Culinary Options')]"
      class="span-2"
      label="Culinary Options"
      outlined
      small-chips
      deletable-chips
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
      v-if="merchant.media.length > 0"
      height="300"
      class="span-2 mb-4"
      hide-delimiters
    >
      <v-carousel-item
        contain
        v-for="(image, index) in merchant.media"
        :key="index"
        :src="image"
        style="object-fit: cover; position: relative"
      >
        <v-icon
          color="red"
          @click="removeMediaFile(index)"
          style="position: absolute; top: 10px; right: 10px; cursor: pointer"
        >
          mdi-delete
        </v-icon>
      </v-carousel-item>
    </v-carousel>

    <v-file-input
      label="Restaurant Gallery"
      multiple
      small-chips
      outlined
      class="span-2"
      v-model="media"
      accept="image/*"
      :rules="
        !isEdit
          ? [
              required(`Restaurant gallery images must be provided`),
              requiredArray(`At least one image must be provided`),
              mediaImageError
                ? 'Height must be half of width (Suggested pixels 1400 * 700)'
                : true
            ]
          : [
              mediaImageError
                ? 'Height must be half of width (Suggested pixels 1400 * 700)'
                : true
            ]
      "
      @change="onMediaSelected"
      :clearable="false"
    >
    </v-file-input>

    <iframe
      v-if="merchant.menu"
      :src="merchant.menu"
      frameborder="0"
      class="span-2 mb-10"
      width="100%"
      height="350"
    ></iframe>

    <v-file-input
      label="Restaurant Menu"
      outlined
      class="span-2"
      v-model="menu"
      accept=".pdf"
      :rules="!isEdit ? [required(`Restaurant menu must be provided`)] : []"
      @change="onMenuSelected"
    >
    </v-file-input>

    <v-card-title>Location</v-card-title>
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
import { getFullPath } from '../../utils/local';
import VueTheMask from 'vue-the-mask';

export default {
  name: 'Form',
  // eslint-disable-next-line vue/no-unused-components
  components: { LoadingDialog, SimpleForm, VueTheMask },

  data: () => ({
    isEdit: false,
    loading: false,
    imageError: false,
    mediaImageError: false,
    passwordVisible: false,
    merchantsService: new MerchantsService(),
    center: { lat: 52.132633, lng: 5.2912659999999505 },
    zoom: 15,
    // only for edit
    disabled: false,

    oldProfileImage: null,
    oldMenu: null,
    oldMedia: [],
    oldMediaFiles: [],
    oldMediaNames: [],

    profileImage: null,
    menu: null,
    media: [],
    // tags: [],
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
    tags: [
      'Date night',
      'Girls night out',
      'Mate date',
      'Family fun time',
      'Pick up',
      'Bogo',
      'Other discounts',
      'Sustainable low waste dining',
      'Healthy eating',
      'Coffee',
      'Breakfast & Brunch',
      'Lunchtime',
      'Dinner',
      'Fine dining',
      'Kid friendly',
      'Group friendly',
      'Pet friendly',
      'Other'
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
      menu: '',
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
    passwordFieldType() {
      return this.passwordVisible ? 'text' : 'password';
    }
  },

  methods: {
    required,
    email,
    requiredArray,

    validate(value, fieldName) {
      console.log(value);
      if (value instanceof Array && value.length == 0) {
        return `${fieldName} must be provided`;
      }
      return !!value || `${fieldName} must be provided`;
    },

    onButtonClick() {
      this.$refs.fileInput.click();
    },
    onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.profileImage = file;
        this.merchant.profileImage = URL.createObjectURL(file);

        let img = new Image();
        img.onload = () => {
          if (img.width != img.height) {
            this.imageError = true;
            this.profileImage = null;
            this.merchant.profileImage = '';
          } else {
            this.imageError = false;
          }
        };
        img.src = URL.createObjectURL(file);
      }
    },
    onMediaSelected(file) {
      const validateImageDimensions = (file) => {
        console.log('start validation');
        return new Promise((resolve, reject) => {
          const image = new Image();
          image.src = URL.createObjectURL(file[0]);
          image.onload = () => {
            if (image.height === image.width / 2) {
              resolve(true);
              this.mediaImageError = false;
            } else {
              reject(
                new Error(
                  'Invalid image dimensions: height must be half of the width.'
                )
              );
              this.mediaImageError = true;
            }
          };
        });
      };

      validateImageDimensions(file);

      if (this.isEdit && this.oldMediaFiles !== file) {
        if (this.oldMedia.length > 0) {
          this.oldMediaFiles = [...this.oldMediaFiles, ...this.oldMedia];
        }
        this.oldMediaFiles = [...this.oldMediaFiles, ...file];

        let media = this.media.map((file) => URL.createObjectURL(file));

        this.merchant.media.push(...media);

        this.media.push(...this.oldMediaNames);

        return;
      }

      if (this.oldMediaFiles !== file) {
        this.oldMediaFiles = [...this.oldMediaFiles, ...file];
        this.media = this.oldMediaFiles;

        this.merchant.media = this.media.map((file) =>
          URL.createObjectURL(file)
        );
      }
    },

    onMenuSelected(file) {
      if (file) {
        this.menu = file;
        this.merchant.menu = URL.createObjectURL(file);
      } else {
        this.menu = null;
        this.merchant.menu = '';
      }
    },

    removeMediaFile(index) {
      this.merchant.media.splice(index, 1);
      this.media.splice(index, 1);
      this.oldMediaNames.splice(index, 1);
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
      // this.tags = await this.merchantsService.fetchAllTags();
      // this.tags = this.tags.map((tag) => tag.tag);

      if (!this.$route.query.id) {
        this.getUserLocation();
        return;
      }
      this.isEdit = true;
      this.loading = true;
      this.merchant = await this.merchantsService.fetchOne(
        this.$route.query.id
      );

      this.oldMediaNames = this.merchant.media.map((media) => {
        return {
          name: media
        };
      });
      this.media.push(...this.oldMediaNames);

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

      this.merchant.profileImage = getFullPath(this.merchant.profileImage);
      this.merchant.menu = getFullPath(this.merchant.menu);
      this.merchant.media = this.merchant.media.map((media) =>
        getFullPath(media)
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

          if (this.merchant.media.length > 0) {
            this.merchant.media = [];

            let media = this.media.filter((media) => {
              if (media.type) {
                return media;
              } else {
                this.merchant.media.push(media.name);
              }
            });

            await Promise.all(
              media.map(async (media) => {
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

          if (this.menu) {
            const formData = new FormData();
            formData.append('media', this.menu);

            const response = await this.$axios.post('/single-file', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            this.merchant.menu = response.data;
          } else {
            this.merchant.menu = this.oldMenu;
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

          if (this.menu) {
            this.merchant.menu = [];

            const formData = new FormData();
            formData.append('media', this.menu);

            const response = await this.$axios.post('/single-file', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            this.merchant.menu = response.data;
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

          if (this.profileImage) {
            this.merchant.profileImage = URL.createObjectURL(this.profileImage);
          }

          if (this.media.length > 0) {
            this.merchant.media = [];

            this.media.map((media) => {
              this.merchant.media.push(URL.createObjectURL(media));
            });
          }

          if (this.menu) {
            this.merchant.menu = URL.createObjectURL(this.menu);
          }

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
