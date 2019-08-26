import { commonAxios, geturlPost } from '../utils/axios';
import Base from './base';

// 数据统计模块
const DataCount = {
    /* -----------学生进出记录 START--------------- */
    //  获取学生进出记录列表
    studentInRecord(params) {
        return commonAxios("post",`${Base.oldUrl}report/inRecord`, params)
    },
    /* -----------学生进出记录 END--------------- */

    /* -----------学生请假记录 START--------------- */
    //  获取学生请假记录列表
    studentLeaveRecord(params) {
        return commonAxios("post",`${Base.oldUrl}report/LeaveReocrd`, params)
    },
    //  获取请假状态
    getLeaveState(params) {
        return commonAxios("post",`${Base.oldUrl}report/leaveState`, params)
    },
    /* -----------学生请假记录 END--------------- */
    
    /* -----------访客来访记录 START--------------- */
    //  获取访客来访记录列表
    getVisitorRecord(params) {
        return commonAxios("post",`${Base.oldUrl}report/visitorRecord`, params)
    },
    //  获取访客来访记录列表
    getVisitorState(params) {
        return commonAxios("post",`${Base.oldUrl}report/visitorState`, params)
    },
    //  获取访客类型数据
    getVisitorType(params) {
        return commonAxios("post",`${Base.oldUrl}report/visitorType`, params)
    },
    /* -----------访客来访记录 END--------------- */

    /* -----------发布通知记录 START--------------- */
    //  获取通知记录列表
    getNoticeRecord(params) {
        return commonAxios("post",`${Base.oldUrl}report/noticeList`, params)
    },
    //  获取通知记录列表
    noticeDetail(params) {
        return commonAxios("post",`${Base.oldUrl}report/noticeDetail`, params)
    },
    /* -----------发布通知记录 END--------------- */

    /* -----------离校/离职档案 START--------------- */
    //  获取学生离校记录
    getStudentRecord(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/getWebStuList`, params)
    },
    //  获取教职工离职记录
    getTeacherRecord(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/getTeacherList`, params)
    },
    /* -----------离校/离职档案 END--------------- */

    /* -----------课程表查询 START--------------- */
        /* --------课表监控--------- */
    //  获取课表监控
    getTimetablesMonitor(type,params) {
        return commonAxios(type,`${Base.bd}edu/timetables/monitor`, params)
    },
        /* --------班级/教室课表--------- */
    //  获取班级/教室课表--按教室查
    getTimetablesClass(type,params) {
        return commonAxios(type,`${Base.bd}edu/report/classroom`, params)
    },
        /* --------教师课表--------- */
    //  获取教师课表--按教师查
    getTimetablesTeacher(type,params) {
        return commonAxios(type,`${Base.bd}edu/report/teacher`, params)
    },
        /* --------学生课表--------- */
    //  获取学生课表--按学生查
    getTimetablesStudent(type,params) {
        return commonAxios(type,`${Base.bd}edu/report/student`, params)
    },
    /* -----------课程表查询 END--------------- */
}
export default DataCount