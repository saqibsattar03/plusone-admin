// import axios from 'axios'
//
// export class BaseService {
//     constructor(route) {
//         this.route = route
//     }
//
//     async fetchAll() {
//         return (await axios.get(this.route)).data;
//     }
//
//     async fetchOne(id) {
//         return (await axios.get(this.route + id)).data;
//     }
//
//     async create(affirmation) {
//         return (await axios.post(this.route, affirmation)).data;
//     }
//
//     async update(affirmation) {
//         return (await axios.patch(this.route + affirmation._id, affirmation)).data;
//     }
//
//     async delete(affirmation) {
//         return (await axios.delete(this.route + affirmation._id)).data;
//     }
// }
