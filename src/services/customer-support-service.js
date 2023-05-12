import axios from 'axios';

export class CustomerSupportService {
  async fetchAll() {
    return (await axios.get('/customer-service/get-all')).data;
  }

  async fetchOne(id) {
    return (await axios.get('/customer-service/get-single?queryId=' + id)).data;
  }

  async delete(cutomer) {
    return (
      await axios.delete('/customer-service/remove?queryId=' + cutomer._id)
    ).data;
  }
}
