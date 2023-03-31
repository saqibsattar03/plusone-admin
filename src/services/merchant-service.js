import axios from 'axios';

export class MerchantsService {
  async fetchAll() {
    return (await axios.get('/persons/all?role=MERCHANT')).data;
  }

  async fetchOne(id) {
    return (await axios.get('/restaurant/profile?restaurantId=' + id)).data;
  }

  async fetchOneVoucher(id) {
    return (await axios.get('/voucher/all-by-restaurant?restaurantId=' + id))
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
      await axios.patch(
        '/restaurant?restaurantId=' + voucher.restaurantId,
        voucher
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
