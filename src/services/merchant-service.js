import axios from 'axios';

export class MerchantsService {
  async fetchAll() {
    return (await axios.get('/persons/all?role=MERCHANT')).data;
  }

  async fetchOne(id) {
    return (await axios.get('/restaurant/profile?restaurantId=' + id)).data;
  }

  async create(user) {
    return (await axios.post('/restaurant/create', user)).data;
  }

  async update(user) {
    return (await axios.patch('/persons/update/' + user._id, user)).data;
  }

  async delete(user) {
    return (await axios.delete('/persons/' + user._id)).data;
  }
}
