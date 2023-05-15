import axios from 'axios';

export class MerchantsService {
  async fetchAll() {
    return (await axios.get('/persons/all?role=MERCHANT')).data;
  }

  async fetchAllTags() {
    return (await axios.get('/restaurant/all-tags')).data;
  }

  async fetchOne(id) {
    return (await axios.get('/restaurant/profile?restaurantId=' + id)).data;
  }

  async fetchOneVoucher(id) {
    return (
      await axios.get(
        `/voucher/single?voucherId=${id.voucherId}&restaurantId=${id.restaurantId}`
      )
    ).data;
  }

  async fetchOneTransactionHistory(id) {
    return (await axios.get('/transaction-history?restaurantId=' + id)).data;
  }

  async fetchAllTransactionHistory() {
    return (await axios.get('/transaction-history'))
      .data;
  }

  async fetchOneDepositHistory(id) {
    return (await axios.get('/transaction-history/' + '?type=CREDIT' + '&restaurantId=' + id)).data;
  }

  async fetchAllDepositHistory() {
    return (await axios.get('/transaction-history?type=CREDIT'))
      .data;
  }

  async accountsAdminStats() {
    return (await axios.get('/restaurant/admin-stats'))
      .data;
  }

  async fetchAllVoucher(id) {
    return (await axios.get('/voucher/all-by-restaurant?restaurantId=' + id))
      .data;
  }

  async create(user) {
    return (await axios.post('/restaurant/create', user)).data;
  }

  async createVoucher(voucher) {
    return (await axios.post('/voucher/create', voucher)).data;
  }

  async update(user) {
    return (await axios.patch('/restaurant?restaurantId=' + user._id, user))
      .data;
  }

  async updateVoucher(voucher) {
    return (
      await axios.patch('/voucher?voucherId=' + voucher.voucherId, voucher)
    ).data;
  }

  async disableVoucher(voucher) {
    return (await axios.patch('/voucher/disable', voucher)).data;
  }

  async depositMoney(deposit) {
    return (
      await axios.post(
        '/deposit-money?restaurantId=' + deposit.restaurantId,
        deposit
      )
    ).data;
  }

  async delete(user) {
    return (await axios.delete('/persons/' + user._id)).data;
  }

  async deleteVoucher(voucher) {
    return (
      await axios.delete('/voucher/remove-single?voucherObjectId' + voucher._id)
    ).data;
  }
}
