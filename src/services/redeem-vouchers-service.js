import axios from 'axios';

export class RedeemVouchersService {
  async fetchAll() {
    return (await axios.get('/voucher/all-redeemed')).data;
  }

  async fetchOne(id) {
    return (await axios.get('/voucher/single?voucherId=' + id)).data;
  }

  // async create(user) {
  //   return (await axios.post('/persons/sign-up', user)).data;
  // }

  // async update(user) {
  //   return (await axios.patch('/persons/update/' + user._id, user)).data;
  // }

  // async delete(user) {
  //   return (await axios.delete('/persons/' + user._id)).data;
  // }
}
