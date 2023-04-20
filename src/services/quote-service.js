import axios from 'axios';

export class QuotesService {
  async fetchAll() {
    return (await axios.get('/quote/all')).data;
  }

  async fetchOne(id) {
    return (await axios.get('/quote?quoteId=' + id)).data;
  }

  async create(quote) {
    return (await axios.post('/quote/create', quote)).data;
  }

  async update(quote) {
    return (await axios.patch('/quote/edit?quoteId=' + quote._id, quote)).data;
  }

  async delete(quote) {
    return (await axios.delete('/quote/remove?quoteId=' + quote._id)).data;
  }
}
