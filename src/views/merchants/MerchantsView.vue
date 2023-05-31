<template>
  <div>
    <div>
      <data-table
        :loader="loadData"
        :headers="headers"
        :allow-add="getUser() && getUser().role === 'ADMIN'"
        @done="$router.back()"
        @add-new="addNew"
        :delete-handler="null"
        :edit-handler="getUser() && getUser().role === 'ADMIN' ? edit : null"
        :view-handler="getUser() && getUser().role === 'ADMIN' ? view : null"
        :voucher-handler="voucherView"
        :account-handler="accountHandler"
      >
        <template #locationName="{ item }">
          <td>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on">{{ item.locationName.substr(0, 40) }} ...</div>
              </template>
              <span>{{ item.locationName }}</span>
            </v-tooltip>
          </td>
        </template>
        <template #isSponsored="{ item }">
          <v-chip
            class="ma-2"
            color="rgba(255, 125, 0,0.08)"
            style="
              color: #ff6e01;
              font-size: 14px;
              font-weight: bold;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 60px;
              height: 24px;
            "
            label
            dense
          >
            {{ item.isSponsored ? 'Yes' : 'No' }}
          </v-chip>
        </template>
      </data-table>
    </div>
  </div>
</template>

<script>
import { MerchantsService } from '../../services/merchant-service';
import DataTable from '../../components/DataTable';
import { getUser } from '../../utils/local';

export default {
  components: { DataTable },

  async mounted() {
    await this.loadData;
  },

  data: () => ({
    user: getUser(),
    items: [],
    merchants_service: new MerchantsService(),

    headers: [
      {
        text: 'Merchant Name',
        value: 'restaurantName',
        sortable: true
      },
      {
        text: 'Location',
        value: 'locationName'
      },
      {
        text: 'Restaurant Code',
        value: 'uniqueCode'
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
    getUser,

    addNew() {
      this.$router.push('/merchant');
    },

    edit(item) {
      this.$router.push(`/merchant?id=${item._id}`);
    },

    view(item) {
      this.$router.push(`/merchant-details?id=${item._id}`);
    },

    voucherView(item) {
      this.$router.push(`/vouchers?restaurantId=${item._id}`);
    },

    accountHandler(item) {
      this.$router.push(`/account-details?restaurantId=${item._id}`);
    },

    async deleteUser(item) {
      await this.merchants_service.delete(item);
    },

    async loadData() {
      if (this.user.role === 'ADMIN') {
        const merchants = await this.merchants_service.fetchAll();
        this.merchants = merchants;

        return this.merchants;
      } else {
        const merchants = await this.merchants_service.fetchAll();
        this.merchants = merchants;
        this.merchants = this.merchants.filter(
          (merchant) =>
            merchant.restaurantData.length > 0 &&
            merchant.restaurantData[0].userId === this.user._id
        );

        return this.merchants;
      }
    }
  }
};
</script>
<style lang="sass" scoped>
.custom-expansion-panels .v-expansion-panel__header--active,
.custom-panel-header.v-expansion-panel__header--active
    background-color: transparent
    box-shadow: none

.panel-transition-enter-active,
.panel-transition-leave-active
    transition: height 0.3s

.panel-transition-enter,
.panel-transition-leave-to
    height: 0
    opacity: 0
    overflow: hidden
.custom-panel-header
    background-color: #FF0000
    color: #FFFFFF
</style>
