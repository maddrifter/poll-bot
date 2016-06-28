class ContactService {
  constructor($http, firebaseApi, ipCookie) {
    this.$http = $http;
    this.firebaseApi = firebaseApi;
    this.ipCookie = ipCookie;
    this.baseUri = 'https://api.leopoll.io';
  }

  getList() {
    return new Promise((resolve, reject) => {
      this.firebaseApi.getUserToken(this.ipCookie('user').id).then((response) => {
        this.$http({
          method: 'GET',
          url: `${this.baseUri}/spark/contacts?token=${response}`
        }).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        })
      });
    });
  }

  getSearchList(query) {
    return new Promise((resolve, reject) => {
      this.firebaseApi.getUserToken(this.ipCookie('user').id).then((response) => {
        this.$http({
          method: 'GET',
          url: `${this.baseUri}/spark/contacts?token=${response}&q=${query}`
        }).then((data) => {
          resolve(data);
        }, (error) => {
          reject(error);
        });
      });
    });
  }

  sendPoll(pollId) {
    return new Promise((resolve, reject) => {
      this.$http({
        method: 'POST',
        url: `${this.baseUri}/spark/send`,
        data: {
          userId: this.ipCookie('user').id,
          pollId: pollId
        }
      }).then((data) => {
        resolve(data);
      }, (error) => {
        reject(error);
      })
    });
  }

  static contactFactory($http, firebaseApi, ipCookie) {
    return new ContactService($http, firebaseApi, ipCookie);
  }
}

ContactService.contactFactory.$inject = ['$http', 'firebaseApi', 'ipCookie'];

export default ContactService;
