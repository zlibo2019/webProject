import { commonAxios, deleteAxios, putAxios } from '../utils/axios';
import Base from './base';

// 教务管理模块
const EducationManage = {
  /* -----------学年/学期管理 START--------------- */
  //------学年/学期管理------//
  // 获取学期名称列表
  getEduSemesterDicList(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/semester/diclist`, params);
  },
  // 获取学期的创建情况
  getSemesterCtInfo(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/semester/createinfo`, params);
  },
  // 获取获取学年学期下拉列表
  getEduSemesterlist(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/semester/list`, params);
  },
  // 获取获取学年学期信息
  getEduSemester(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/semester`, params);
  },
  // 新增学期学年
  postSemester(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/semester`, params);
  },
  // 修改学期学年
  putSemester(params, id) {
    return putAxios(`${Base.bd}api/edu/semester` + (id ? '/' + id : ''), params);
  },
  // 删除学期学年
  deleteSemester(params, id) {
    return deleteAxios(`${Base.bd}api/edu/semester` + (id ? '/' + id : ''), params);
  },
  

  //------校历管理------//
  //  获取周期下拉列表
  getCalendarlist(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/calendar/list`, params)
  },
  //  获取校历
  getCalendar(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/calendar`, params)
  },
  //  修改 校历信息 type: 1正常 2调课 3放假 
  putCalendar(params, id) {
    return putAxios(`${Base.bd}api/edu/calendar` + (id ? '/' + id : ''), params)
  },
  //  修改 校历月份备注
  putCalendarRemark(params, id) {
    return putAxios(`${Base.bd}api/edu/calendar/remark` + (id ? '/' + id : ''), params)
  },
  /* -----------学年/学期管理 END--------------- */


  /* -----------上课时间 START--------------- */
  //  获取上课时间信息表格
  getLessontime(type, params, id) {
    return commonAxios(type, `${Base.bd}api/edu/lessontime` + (id ? '/' + id : ''), params)
  },
  delLessontime(params, id) {
    return deleteAxios(`${Base.bd}api/edu/lessontime` + (id ? '/' + id : ''), params)
  },
  //  获取上课时间信息明细
  getLessontimeDetail(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/lessontime/detail`, params)
  },
  //  获取上课时间信息明细
  getLessontimeSectionname(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/lessontime/sectionname`, params)
  },
  /* -----------上课时间 END--------------- */


  /* -----------课程管理 START--------------- */
  //------课程科目------//
  // 获取课程信息
  getCourse(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/course`, params);
  },
  // 新增课程信息
  postCourse(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/course`, params);
  },
  // 修改课程信息 
  putCourse(params, id) {
    return putAxios(`${Base.bd}api/edu/course` + (id ? '/' + id : ''), params);
  }, 
  // 删除课程信息
  deleteCourse(params, id) {
    return deleteAxios(`${Base.bd}api/edu/course` + (id ? '/' + id : ''), params);
  },  
  
  //------教师任课------//
  //获取教师任课排课周期列表
  getTeachingList(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/teaching/list`, params);
  },
  //获取教师任课排课周期列表
  getTeachingList(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/teaching/list`, params);
  },
  // 获取 教师列表
  getTeacherList(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/teaching/getTeacherList`, params);
  },   
  // 获取 教师任课教职工档案结构-部门+人的树结构
  getTeachingClassList(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/teaching/depuser`, params);
  },  
  // // 获取 教师任课班级列表 
  // getTeachingClassList(type, params) {
  //   return commonAxios(type, `${Base.bd}api/edu/teaching/classlist`, params);
  // },
  // 获取教师任课信息
  getTeaching(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/teaching`, params);
  },
  // 修改教师任课信息
  putTeaching(params, id) {
    return putAxios(`${Base.bd}api/edu/teaching` + (id ? '/' + id : ''), params);
  },  
  // 复制往期课表
  copyTeaching(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/teaching/copy`, params);
  },

  //------排课 学年(学期)------//
  // 查询排课学年下拉列表
  getTimetablesYearList(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/timetables/yearlist`, params)
  },
  // 查询排课学期下拉列表
  getTimetablesSemesterList(type, params) {
    return commonAxios(type, `${Base.bd}api/edu/timetables/semesterlist`, params)
  },  
  //  查询排课表格
  getTimetables(type, params) {
    return commonAxios(type, `${Base.bd}edu/timetables`, params)
  },
  // 新增排课信息
  postTimetables(type, params) {
    return commonAxios(type, `${Base.bd}edu/timetables`, params);
  },
  // 复制课表
  postTimetablesCopy(type, params) {
    return commonAxios(type, `${Base.bd}edu/timetables/copy`, params);
  },
  // 按条件删除行政排课
  postTimetablesDelete(type, params) {
    return commonAxios(type, `${Base.bd}edu/timetables/delete`, params);
  },
  // 查询排课完整率
  postTimetablesRate(type, params) {
    return commonAxios(type, `${Base.bd}edu/timetables/rate`, params);
  },
  // 查询已排课程科目数量
  getSectionNum(type, params) {
    return commonAxios(type, `${Base.bd}edu/report/sectionNum`, params)
  },
  /* -----------课程管理 END--------------- */

  /* -----------选课走班 START--------------- */
  //------走班课程管理------//
  //查询走班课程
  getClassfiedSubject(type, params) {
    return commonAxios(type, `${Base.bd}edu/classfiedSubject`, params)
  },
  //新增走班课程
  postClassfiedSubject(type, params) {
    return commonAxios(type, `${Base.bd}edu/classfiedSubject`, params);
  },
  //修改走班课程
  putClassfiedSubjectById(type, params) {
    return putAxios(`${Base.bd}edu/classfiedSubject` + (id ? '/' + id : ''), params);
  },
  //按id查询走班课程
  getClassfiedSubjectById(type, params) {
      return putAxios(`${Base.bd}edu/classfiedSubject` + (id ? '/' + id : ''), params);
  },
  //删除走班课程
  deleteClassfiedSubjectById(type, params) {
    return deleteAxios(`${Base.bd}edu/classfiedSubject` + (id ? '/' + id : ''), params);
  },    

  //------走班学生管理------//
  //查询走班学生
  getClassfiedStudent(type, params) {
    return commonAxios(type, `${Base.bd}edu/classfiedSubjectStudent`, params)
  },  
  //新增走班学生
  postClassfiedStudent(type, params) {
    return commonAxios(type, `${Base.bd}edu/classfiedSubjectStudent`, params)
  },   
  //修改走班学生
  putClassfiedStudentById(params, id) {
    return putAxios(`${Base.bd}edu/classfiedSubjectStudent` + (id ? '/' + id : ''), params);
  },    
  //按id查询走班课程
  getClassfiedStudentById(type, params) {
      return putAxios(`${Base.bd}edu/classfiedSubjectStudent` + (id ? '/' + id : ''), params);
  },
  //删除走班学生
  delClassfiedStudentById(params, id) {
    return deleteAxios(`${Base.bd}edu/classfiedSubjectStudent` + (id ? '/' + id : ''), params);
  }, 

  //------走班排课 学年(学期)------//
  //查询树形走班科目
  getClassfiedSubjectTree(type, params) {
    return commonAxios(type, `${Base.bd}edu/classfiedSubject/tree`, params)
  },  
  //查询走班课程
  getClassfiedTimetables(type, params) {
    return commonAxios(type, `${Base.bd}edu/classfiedTimetables`, params)
  },
  //新增走班排课
  postClassfiedTimetables(type, params) {
    return commonAxios(type, `${Base.bd}edu/classfiedTimetables`, params)
  },
  // 复制课表
  postClassfiedTimetablesCopy(type, params) {
    return commonAxios(type, `${Base.bd}edu/classfiedTimetables/copy`, params);
  },  
  // 按条件删除走班排课
  postClassfiedTimetablesDelete(type, params) {
    return commonAxios(type, `${Base.bd}edu/classfiedTimetables/delete`, params);
  },  
  /* -----------选课走班 END--------------- */  

}
export default EducationManage