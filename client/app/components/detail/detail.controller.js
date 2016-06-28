import angular from 'angular';
import Chart from 'chart.js';
import * as _ from 'lodash';
var moment = require('moment');

Chart.defaults.global.legend.display = false;

class DetailController {
  static $inject = ['firebaseApi', '$stateParams', '$scope', 'ipCookie', '$state', '$timeout'];
  constructor(firebaseApi, $stateParams, $scope, ipCookie, $state, $timeout) {
    this.name = 'detail';
    this.firebaseApi = firebaseApi;
    this.$stateParams = $stateParams;
    this.$scope = $scope;
    this.ipCookie = ipCookie;
    this.$state = $state;
    //this.$timeout = $timeout;
    this.chip = {
      data: [],
      readonly: true,
      removable: false
    };
    this.pollInfo = {};
    this.loadAnswers();
    this.watchChanges();
    this.isOpen = [];
    this.userOps = [];
    this.colors = ['#ff6384', '#36a2eb', '#ffce56', '#118C4E', '#C1E1A6', '#FF9009'];
    this.charts = {};
    this.answers = [];
  }

  loadAnswers() {
    let pollId = this.$stateParams.id;
    return firebase.database().ref(`/answers/${pollId}`).once('value')
    .then(snapshot => {
      let answers = snapshot.val();
      let answersIndex = {};

      if(answers && Object.keys(answers).length > 0){
        this.answers = Object.keys(answers).map(key => {
          answersIndex[key] = answers[key];
          return answers[key];
        });
        _.forEach(this.pollInfo.questions, (question, key) => {
          if (question.type == 'multiple_choice') {
            this.renderChart(key);
          }
        });
      }

      //update results based on new answers
      firebase.database().ref().child(`/answers/${pollId}`).on('child_added', (snapshot) => {
        if(answersIndex[snapshot.key]){
          //ignore existing answer
          return;
        }
        let answer = snapshot.val();
        this.answers.push(answer);
        _.forEach(this.pollInfo.questions, (question, key) => {
          if (question.type == 'multiple_choice' && answer['question-'+key]) {
            //update chart
            let chart = this.charts['chart-'+key];
            if(!chart){
              //lets render
              this.renderChart(key);
            }else{
              //update the data
              var optIndex = answer['question-'+key] - 1;
              chart.data.datasets[0].data[optIndex]++;
              this.userOps[optIndex].push(answer.name);
              chart.update();
            }
          }
        });
      });
    });
  }

  watchChanges() {
    let pollId = this.$stateParams.id;
    return firebase.database().ref(`/polls/${this.ipCookie('user').id}/${pollId}`).on('value', (snapshot) => {
      let pollInfo = snapshot.val();
      this.pollInfo.status = pollInfo.status;
      this.pollInfo.totalUsers = pollInfo.totalUsers;
      this.pollInfo.completedUsers = pollInfo.completedUsers;
      this.pollInfo.sendOnString = `Sent on ${moment(pollInfo.sendOn).format('MMM Do YYYY, hh:mm')}`;
    });
  }

  getDisplayQueryType(type) {
    if (type == 'multiple_choice') {
      return 'Multiple Choice';
    } else if (type == 'short_answer') {
      return 'Short Answer';
    } else {
      return 'Attachment';
    }
  }

  renderChart(index) {
      console.log('rendering chart');
      let ctx = document.getElementById(`pie-chart-${index}`).getContext('2d');
      ctx.canvas.width = 150;
      ctx.canvas.height = 150;
      let chartOps = {
        type: 'pie',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: this.colors,
              hoverBackgroundColor: this.colors
            }
          ]
        }
      };
      _.forEach(this.pollInfo.questions[index].options, (option, key) => {
        chartOps.data.datasets[0].data[key] = 0;
        chartOps.data.labels[key] = option;
        this.userOps[key] = [];
      });
      _.forEach(this.answers, (answer) => {
        var optIndex = answer[`question-${index}`] - 1;
        chartOps.data.datasets[0].data[optIndex]++;
        this.userOps[optIndex].push(answer.name);
      });
      this.charts['chart-'+index] = new Chart(ctx, chartOps);
  }

  endPoll() {
    this.pollInfo.updated = new Date().getTime();
    this.pollInfo.status = 'cancelled';
    this.pollInfo.sendTo = _.map(this.pollInfo.sendTo, (contact) => {
      delete contact.name;
      return contact;
    });
    this.pollInfo.questions = _.map(this.pollInfo.questions, (question) => {
      delete question.$$hashKey;
      return question;
    });
    this.firebaseApi.updatePoll(this.pollInfo, this.ipCookie('user').id, this.$stateParams.id).then((response) => {
      this.$state.go('home');
    });
  }
}

export default DetailController;
