import axios from 'axios';

export class UploadImageService {
  async uploadSingleImage(image) {
    return (await axios.post('/single-file', image)).data;
  }

  // async fetchAll() {
  //   return (await axios.get('/persons/all?role=USER')).data;
  // }

  // async fetchOne(id) {
  //   return (await axios.get('/persons/single/' + id)).data;
  // }

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
