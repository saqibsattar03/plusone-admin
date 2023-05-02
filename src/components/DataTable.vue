<template>
  <v-card :class="[hasElevation ? 'elevation-2' : 'elevation-0']">
    <slot name="tabs" />
    <v-card-title
      :class="`d-flex ${
        $vuetify.breakpoint.width > 800 ? 'flex-row' : 'flex-column'
      } justify-start align-start`"
      :style="$vuetify.breakpoint.width > 800 ? '' : 'gap: 10px'"
    >
      <div class="d-flex align-center">
        <v-btn
          :class="[$vuetify.breakpoint.width > 800 ? 'mr-2' : '']"
          elevation="0"
          v-if="allowBack"
          @click="$router.go(-1)"
        >
          <v-icon class="v-btn__pre-icon">mdi-arrow-left</v-icon>
        </v-btn>
        <span class="data-table__header">{{ title }}</span>
      </div>
      <v-spacer v-if="$vuetify.breakpoint.width > 800" />

      <div
        style="margin-right: 20px"
        :style="[
          $vuetify.breakpoint.width < 800
            ? { width: 100 + '%' }
            : { width: 400 + 'px' }
        ]"
      >
        <v-text-field
          v-if="allowSearch"
          v-model="search"
          solo
          label="Search anything..."
          dense
          hide-details
        />
      </div>
      <slot
        name="primary-action"
        :class="[$vuetify.breakpoint.width > 800 ? 'my-2' : '']"
      />

      <v-btn
        :class="[$vuetify.breakpoint.width > 800 ? 'mr-2' : '']"
        :style="[$vuetify.breakpoint.width < 800 ? { width: 100 + '%' } : '']"
        v-if="addBenefits"
        color="primary"
        elevation="0"
        @click="$emit('add-benefits')"
      >
        Update Event Benefits
      </v-btn>

      <v-btn
        :style="[$vuetify.breakpoint.width < 800 ? { width: 100 + '%' } : '']"
        v-if="allowAdd"
        color="primary"
        elevation="0"
        @click="$emit('add-new')"
      >
        <v-icon class="v-btn__pre-icon" small>mdi-plus</v-icon>&nbsp; Add New
      </v-btn>

      <v-btn
        :style="[$vuetify.breakpoint.width < 800 ? { width: 100 + '%' } : '']"
        :class="[$vuetify.breakpoint.width > 800 ? 'ml-2' : '']"
        color="primary"
        id="refresh"
        class="refresh"
        dark
        @click="loadData"
        v-if="allowRefresh"
      >
        <v-icon class="v-btn__pre-icon" small>mdi-refresh</v-icon>&nbsp; Refresh
      </v-btn>

      <v-btn
        v-if="allowFilters"
        :class="[$vuetify.breakpoint.width > 800 ? 'my-2' : '']"
        icon
        style="margin-left: 10px"
      >
        <v-icon @click="$emit('filter')">mdi-filter</v-icon>
      </v-btn>
    </v-card-title>

    <v-data-table
      :loading="loading"
      :items="items"
      :headers="headersValue"
      :search="search"
      height="calc(100vh - 270px)"
      mobile-breakpoint="800"
      fixed-header
    >
      <template v-slot:item="{ item }">
        <tr v-if="$vuetify.breakpoint.width > 800">
          <td
            v-for="(elem, key) of headers"
            :key="key"
            :class="`text-${elem.align === 'right' ? 'end' : 'start'}`"
            :style="`max-width: calc(100% / ${headersValue.length})`"
          >
            <slot :name="elem.value" :item="item">{{ item[elem.value] }}</slot>
          </td>
          <td
            v-if="
              viewHandler ||
              editHandler ||
              deleteHandler ||
              disableHandler ||
              voucherHandler ||
              accountHandler
            "
            :style="`max-width: calc(100% / ${headersValue.length})`"
            class="py-2"
          >
            <div
              class="d-flex justify-end align-center flex-wrap"
              style="gap: 8px"
            >
              <slot name="extra-actions" :item="item" />

              <v-icon
                v-if="accountHandler"
                @click="accountHandler(item)"
                color="#71797E"
                small
              >
                mdi-account
              </v-icon>

              <v-icon
                v-if="voucherHandler"
                @click="voucherHandler(item)"
                color="#71797E"
                small
                >mdi-ticket
              </v-icon>

              <v-icon
                v-if="viewHandler"
                @click="viewHandler(item)"
                color="blue"
                small
                >mdi-eye
              </v-icon>

              <v-icon
                v-if="editHandler"
                @click="editHandler(item)"
                color="green"
                small
                >mdi-pencil
              </v-icon>

              <v-icon
                v-if="deleteHandler"
                @click="onDelete(item)"
                color="red"
                small
                >mdi-delete
              </v-icon>

              <v-icon
                v-if="disableHandler"
                @click="disableHandler(item)"
                color="red"
                small
                >mdi-close
              </v-icon>
            </div>
          </td>
        </tr>
        <tr v-else class="v-data-table__mobile-table-row">
          <td
            v-for="(elem, key) of headers"
            :key="key"
            :class="`v-data-table__mobile-row text-${
              elem.align === 'right' ? 'end' : 'start'
            }`"
          >
            <div class="v-data-table__mobile-row__header">{{ elem.text }}</div>
            <div class="v-data-table__mobile-row__cell">
              <slot :name="elem.value" :item="item">{{
                item[elem.value]
              }}</slot>
            </div>
          </td>
          <td
            v-if="
              viewHandler ||
              editHandler ||
              deleteHandler ||
              disableHandler ||
              voucherHandler ||
              accountHandler
            "
            class="v-data-table__mobile-row text-end"
            style="text-align: right"
          >
            <div class="v-data-table__mobile-row__header">Action</div>
            <div class="v-data-table__mobile-row__cell d-flex flex-column">
              <slot name="extra-actions" :item="item" />

              <v-btn
                class="my-1"
                dark
                v-if="accountHandler"
                small
                @click="accountHandler(item)"
                color="primary"
              ></v-btn>

              <v-btn
                class="my-1"
                dark
                v-if="voucherHandler"
                small
                @click="voucherHandler(item)"
                color="primary"
              >
                Vouchers
              </v-btn>

              <v-btn
                class="my-1"
                dark
                v-if="viewHandler"
                small
                @click="viewHandler(item)"
                color="primary"
              >
                View
              </v-btn>
              <v-btn
                dark
                class="my-1"
                v-if="editHandler"
                small
                color="green"
                @click="editHandler(item)"
              >
                Edit
              </v-btn>
              <v-btn
                dark
                class="my-1"
                v-if="deleteHandler"
                small
                color="red"
                @click="onDelete(item)"
              >
                Delete
              </v-btn>
              <v-btn
                class="my-1"
                dark
                v-if="disableHandler"
                small
                @click="disableHandler(item)"
                color="red"
              >
                Disable
              </v-btn>
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>

    <error-dialog v-if="!hideDialog" v-model="error" :error="errorValue" />
  </v-card>
</template>

<script>
import ErrorDialog from './ErrorDialog';

export default {
  name: 'DataTable',
  components: { ErrorDialog },
  props: {
    allowRefresh: {
      type: Boolean,
      default: true
    },
    allowSearch: {
      type: Boolean,
      default: true
    },
    allowAdd: {
      type: Boolean,
      default: false
    },
    addBenefits: {
      type: Boolean,
      default: false
    },

    allowFilters: {
      type: Boolean,
      default: false
    },

    allowBack: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: null
    },

    loader: {
      type: Function,
      required: true
    },

    headers: {
      type: Array,
      required: true
    },

    editHandler: {
      type: Function,
      default: null
    },

    viewHandler: {
      type: Function,
      default: null
    },

    deleteHandler: {
      type: Function,
      default: null
    },

    voucherHandler: {
      type: Function,
      default: null
    },

    disableHandler: {
      type: Function,
      default: null
    },

    accountHandler: {
      type: Function,
      default: null
    },

    hasElevation: {
      type: Boolean,
      default: true
    },
    hideDialog: {
      type: Boolean,
      default: false
    }
  },

  emits: ['add-new'],

  mounted() {
    this.headersValue = [...this.headers];
    if (
      this.editHandler ||
      this.deleteHandler ||
      this.viewHandler ||
      this.disableHandler ||
      this.voucherHandler ||
      this.accountHandler
    ) {
      this.headersValue.push({
        text: 'Actions',
        align: 'right',
        search: false,
        sortable: false
      });
    }

    this.loadData();
  },

  data: () => ({
    search: '',
    items: [],
    error: false,
    loading: false,
    errorValue: {},
    headersValue: []
  }),

  methods: {
    async loadData() {
      this.loading = true;
      try {
        this.items = await this.loader();
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.errorValue = {
          title: 'Error while loading data',
          description:
            e?.response?.data?.error ??
            'Some error occured, Please try again later'
        };
        this.error = true;

        // if (e.response.status === 401) {
        //   this.errorValue = {
        //     title: 'Error while loading data',
        //     description:
        //       e?.response?.data?.error ??
        //       'Your authentication timing is expired, Please try to login again'
        //   };
        //   this.error = true;

        //   localStorage.clear();

        //   setTimeout(() => {
        //     window.location.reload();
        //   }, 10000);
        // } else {
        //   this.errorValue = {
        //     title: 'Error while loading data',
        //     description:
        //       e?.response?.data?.error ??
        //       'Some error occured, Please try again later'
        //   };
        //   this.error = true;
        // }
      }
    },

    async onDelete(item) {
      if (confirm('This Item will be delete')) {
        try {
          this.loading = true;
          await this.deleteHandler(item);
          this.loading = false;
          this.items.splice(this.items.indexOf(item), 1);
        } catch (e) {
          window.console.log(e);
        }
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.data-table

  &__header
    font-size: 25px
    font-family: google-sans, sans-serif
</style>
