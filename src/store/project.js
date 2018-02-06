import { observable, action ,useStrict} from 'mobx';
//import axios from 'axios';
useStrict(true);

class Project {
  @observable fetching = false
  @observable content = []
  @observable availableId = 0
  @observable text = ''


  @action
  clearZen() {
    this.content = []
    this.availableId = 0
  }
}


export default new Project()
