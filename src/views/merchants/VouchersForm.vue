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
      {{ isEdit ? 'Update Voucher' : 'Add New Voucher' }}
    </p>

    <v-img
      v-if="VoucherImageObjectURL && !isEdit"
      contain
      max-height="300"
      class="span-2 mb-4"
      :src="VoucherImageObjectURL"
    ></v-img>

    <v-file-input
      v-if="!isEdit"
      v-model="voucherImage"
      accept="image/*"
      :rules="!isEdit ? [required(`Voucher Image must be provided`)] : []"
      class="span-2"
      :placeholder="isEdit ? 'Update Voucher Image' : 'Add Voucher Image'"
      outlined
    >
      <template v-slot:selection="{ index, text }">
        <v-chip v-if="index < 2" color="primary" dark label small>
          {{ text }}
        </v-chip>
      </template>
    </v-file-input>

    <v-select
      v-if="!isEdit"
      v-model="voucher.voucherObject.voucherPreference"
      :rules="[required('Voucher Preference must be provided')]"
      class="span-2"
      :items="voucherPreference"
      label="Voucher Preference"
      outlined
    />

    <v-select
      v-if="!isEdit"
      v-model="voucher.voucherObject.voucherType"
      :rules="[required('Voucher Type must be provided')]"
      class="span-2"
      :items="voucherType"
      label="Voucher Type"
      outlined
    />

    <v-text-field
      v-if="voucher.voucherObject.voucherType === 'DISCOUNTED'"
      v-model="voucher.voucherObject.discount"
      :rules="[required('Discount must be provided')]"
      class="span-2"
      label="Discount"
      type="number"
      outlined
    />

    <v-text-field
      v-if="!isEdit"
      v-model="voucher.voucherObject.title"
      :rules="[required('Title must be provided')]"
      class="span-2"
      label="Title"
      outlined
    />

    <v-textarea
      v-model="voucher.voucherObject.description"
      :rules="[required('Description must be provided')]"
      class="span-2"
      label="Description"
      outlined
    />

    <v-text-field
      v-model="voucher.voucherObject.estimatedSavings"
      :rules="[required('Estimated Savings must be provided')]"
      class="span-2"
      label="Estimated Savings"
      outlined
    />

    <v-text-field
      v-model="voucher.voucherObject.estimatedCost"
      :rules="[required('Estimated Cost must be provided')]"
      class="span-2"
      label="Estimated Cost"
      type="number"
      outlined
    />

    <loading-dialog v-model="loading" message="Fetching Voucher Data" />
  </SimpleForm>
</template>

<script>
import SimpleForm from '../../components/Form';
import { MerchantsService } from '../../services/merchant-service';
import { UploadImageService } from '@/services/upload-image-service';
import LoadingDialog from '../../components/LoadingDialog';
import { required, email } from '@/utils/validators';

export default {
  name: 'Form',
  components: { LoadingDialog, SimpleForm },

  data: () => ({
    isEdit: false,
    loading: false,
    merchantsService: new MerchantsService(),
    upload_image_service: new UploadImageService(),

    // only for edit
    disabled: false,

    oldVoucherImage: null,

    voucherImage: null,

    voucherPreference: ['STUDENT', 'NON-STUDENT', 'BOTH'],
    voucherType: ['BOGO', 'DISCOUNTED'],

    voucher: {
      restaurantId: '',
      voucherId: '',
      voucherObject: {
        title: '',
        voucherImage: '',
        voucherPreference: '',
        voucherType: '',
        discount: 0,
        description: '',
        estimatedSavings: '0',
        estimatedCost: 0
      }
    }
  }),

  mounted() {
    this.loadVoucher();
  },

  computed: {
    VoucherImageObjectURL() {
      return this.voucherImage ? URL.createObjectURL(this.voucherImage) : '';
    }
  },

  methods: {
    required,
    email,

    async loadVoucher() {
      if (this.$route.query.id) {
        this.voucher.restaurantId = this.$route.query.id;
      }
      if (!this.$route.query.restaurantId) return;
      this.isEdit = true;
      this.loading = true;
      let voucher = await this.merchantsService.fetchOneVoucher({
        restaurantId: this.$route.query.restaurantId,
        voucherId: this.$route.query.voucherId
      });

      this.voucher = {
        restaurantId: this.$route.query.restaurantId,
        voucherId: this.$route.query.voucherId,
        voucherObject: {
          voucherType: voucher[0].voucherObject.voucherType,
          discount: voucher[0].voucherObject.discount,
          description: voucher[0].voucherObject.description,
          estimatedSavings: voucher[0].voucherObject.estimatedSavings,
          estimatedCost: voucher[0].voucherObject.estimatedCost
        }
      };

      this.loading = false;
    },
    async submit(context) {
      if (this.isEdit) {
        context.changeLoadingMessage('Updating Voucher');

        try {
          // updating Voucher
          this.merchantsService.updateVoucher(this.voucher);
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
        context.changeLoadingMessage('Creating Voucher');
        try {
          // creating voucher

          if (this.voucherImage) {
            const formData = new FormData();
            formData.append('media', this.voucherImage);

            const response = await this.$axios.post('/single-file', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });

            this.voucher.voucherObject.voucherImage = response.data;
          }

          await this.merchantsService.createVoucher(this.voucher);
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
