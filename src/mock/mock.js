// 引入mockjs
const Mock = require('mockjs');
import {SchoolTable,SchoolDeviceTable,PlaceTable,Semesterlist,Semester,Lessontime,Course} from './data';
 
// Mock.mock( url, post/get , 返回的数据)；
Mock.mock('api/web/devicelist', 'get', SchoolTable);
Mock.mock('SchoolDeviceTable', 'post', SchoolDeviceTable);
Mock.mock('PlaceTable', 'post', PlaceTable);
Mock.mock('edu/semesterlist', 'get', Semesterlist);
Mock.mock('edu/semester', 'get', Semester);
Mock.mock('edu/lessontime', 'post', Lessontime);

Mock.mock('edu/course', 'post', Course);