import Common from './common';
import Login from './login';
import DeviceControl from './deviceControl';
import BasicInfo from './basicInfo';
import RoleAuthority from './roleAuthority';
import DataCount from './dataCount';
import Rules from './rules';
import EducationManage from './educationManage';


const APIList = {
  Common,
  Login,
  DeviceControl,
  BasicInfo,
  RoleAuthority,
  DataCount,
  Rules,
  EducationManage,
};

export default {

  install(Vue) {
    console.log('install........');
    Vue.prototype.$api = APIList
  }
};