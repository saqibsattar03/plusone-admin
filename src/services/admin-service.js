import axios from 'axios';

export class AdminsService {
  async fetchAll() {
    return (await axios.get('persons/all?role=ADMIN')).data;
  }

  async fetchOne(id) {
    return (await axios.get('/persons/single/' + id)).data;
  }

  async create(admin) {
    return (await axios.post('/persons/sign-up', admin)).data;
  }

  async update(admin) {
    return (await axios.patch('/persons/update', admin)).data;
  }

  async delete(admin) {
    return (await axios.delete('/persons/' + admin._id)).data;
  }
}
