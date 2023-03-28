<template>
  <data-table
    :loader="loadData"
    :headers="headers"
    title="Merchants"
    :allow-add="userScopes.includes('merchants:new') && true"
    @done="$router.back()"
    @add-new="addNew"
    :delete-handler="null"
    :edit-handler="userScopes.includes('merchants:edit') ? edit : null"
    :view-handler="userScopes.includes('merchants:view') ? view : null"
  >
    <template #firstname="{ item }">
      {{ item.firstname }} {{ item.surname }}
    </template>

    <template #locationName="{ item }">
      {{ item.locationName }}
    </template>

    <template #restaurantCode="{ item }">
      {{ item.restaurantData[0].uniqueCode }}
    </template>

    <template #isSponsored="{ item }">
      {{ item.restaurantData[0].isSponsored }}
    </template>

    <template #phoneNumber="{ item }">
      {{ item.restaurantData[0].phoneNumber }}
    </template>
  </data-table>
</template>

<script>
import { MerchantsService } from '../../services/merchant-service';
import DataTable from '../../components/DataTable';
import { getUserScopes } from '../../utils/local';
import Vue from 'vue';

export default {
  components: { DataTable },

  mounted() {
    this.loadData;
  },

  data: () => ({
    items: [],
    merchants_service: new MerchantsService(),
    userScopes: getUserScopes(),

    headers: [
      {
        text: 'Merchant Name',
        value: 'firstname',
        sortable: true
      },
      {
        text: 'Location',
        value: 'locationName'
      },
      {
        text: 'Restaurant Code',
        value: 'restaurantCode'
      },
      {
        text: 'Sponsored',
        value: 'isSponsored'
      },
      {
        text: 'Contact',
        value: 'phoneNumber'
      }
    ],

    merchants: [],
    apiKey: 'AIzaSyCqP_po3VVErDM_bd9sGVUmMNDJwEhHyUA'
  }),

  methods: {
    addNew() {
      this.$router.push('/merchant');
    },

    edit(item) {
      this.$router.push(`/merchant?id=${item._id}`);
    },

    view(item) {
      this.$router.push(`/merchant-details?id=${item._id}`);
    },

    async deleteUser(item) {
      await this.merchants_service.delete(item);
    },

    async loadData() {
      const merchants = await this.merchants_service.fetchAll();
      this.merchants = merchants;

      await Promise.all(
        this.merchants.map(async (merchant) => {
          const axiosWithoutToken = this.$axios.create({
            headers: {
              'Content-Type': 'application/json'
            }
          });
          await axiosWithoutToken
            .get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${merchant.restaurantData[0].location.coordinates[1]},${merchant.restaurantData[0].location.coordinates[0]}&key=${this.apiKey}`
            )
            .then((response) => {
              if (response.data.results.length > 0) {
                const locationName = response.data.results[0].formatted_address;
                Vue.set(merchant, 'locationName', locationName);
              } else {
                return 'Location not found';
              }
            })
            .catch((error) => {
              console.log(error, 'error');
            });
        })
      );

      return this.merchants;
    }
  }
};
</script>
