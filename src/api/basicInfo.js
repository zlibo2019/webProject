import { commonAxios } from '../utils/axios';
import Base from './base';
//  基础信息模块
const BasicInfo = {
    checkFace(key) {
        return commonAxios("get", `/qiniuApi/${key}?tusdk-face/detection`)
    },
    /* -----------学校档案 START--------------- */
    //  加载学校档案
    selectSchoolInfo(params) {
        return commonAxios("get",`${Base.oldUrl}schoolInfo/selectSchoolInfo`, params)
    },
    //  更新学校档案
    updateSchoolInfo(params) {
        return commonAxios("post",`${Base.oldUrl}schoolInfo/updateSchoolInfo`, params)
    },
    /* -----------学校档案 END--------------- */


    /* -----------学生/家长档案 START--------------- */
    //  获取学生家长table列表
    getTableListStudent(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/getWebStuList`, params)
    },
    //  获取学生家长关系
    getRelationshipStudent(params) {
        return commonAxios("post",`${Base.oldUrl}code/getItem`, params)
    },
    //  新增班级
    addClassListStudent(params) {
        return commonAxios("post",`${Base.oldUrl}dept/addList`, params)
    },
    //  删除班级
    delClassListStudent(params) {
        return commonAxios("get",`${Base.oldUrl}dept/delete`, params)
    },
    //  新增学生档案
    addStudent(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/add`, params)
    },
    //  修改学生档案
    modifyStudent(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/modify`, params)
    },
    //  批量调动
    modifyDepStudent(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/modifyDep`, params)
    },
    //  学生毕业
    delUserStudent(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/delUser`, params)
    },
    //  生成账号密码
    setSysPwdStudent(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/setSysPwd`, params)
    },
    //  重置密码
    reastPassword(params) {
        return commonAxios("post",`${Base.oldUrl}account/reset_pwd`, params)
    },
    //  更改为主账户
    modifyAccountType(params) {
        return commonAxios("put",`${Base.oldUrl}account/change_slave_parent_account_to_master_by_force`, params)
    },
    //  删除主账户
    delAccount(params) {
        return commonAxios("put",`${Base.oldUrl}account/delete_main_parent_account`, params)
    },
    //  根据学生id获取次账户信息
    getSubAccount(params) {
        return commonAxios("get",`${Base.oldUrl}account/get_parent_sub_account_by_stu_id`, params)
    },
    /* -----------学生/家长档案 END--------------- */


    /* -----------教职工档案 START--------------- */
    //  获取教职工table列表
    getTableListTeacher(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/getTeacherList`, params)
    },
    //  获取教职工职位
    getJobTeacher(params) {
        return commonAxios("post",`${Base.oldUrl}code/getItem`, params)
    },
    //  新增部门
     addDepTeacher(params) {
        return commonAxios("post",`${Base.oldUrl}dept/add`, params)
    },
    //  修改部门名称
    modifyDepNameTeacher(params) {
        return commonAxios("post",`${Base.oldUrl}dept/modify`, params)
    },
    //  删除部门
    delClassListTeacher(params) {
        return commonAxios("get",`${Base.oldUrl}dept/delete`, params)
    },
    //  批量调动
    modifyDepTeacher(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/modifyDep`, params)
    },
    //  教师离职
    delUserTeacher(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/delUser`, params)
    },
    //  生成账号密码
    setSysPwdTeacher(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/setSysPwd`, params)
    },
    //  新增教师档案
    addTeacher(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/add`, params)
    },
    //  修改教师档案
    modifyTeacher(params) {
        return commonAxios("post",`${Base.oldUrl}userInfo/modify`, params)
    },
    /* -----------教职工档案 END--------------- */


    /* -----------卡管理中心 START--------------- */
    //  获取卡片状态
    getCardState(params) {
        return commonAxios("post",`${Base.oldUrl}card/cardState`, params)
    },
    //  获取卡片列表
    getCardList(params) {
        return commonAxios("post",`${Base.oldUrl}card/getCardList`, params)
    },
    getFaceList(params) {
        return commonAxios("get", "face/get_face_list", params)
    },
    //  发卡接口
    issueSlaveCard(params) {
        return commonAxios("post",`${Base.oldUrl}card/issueSlaveCard`, params)
    },
    //  卡片挂失
    lossCard(params) {
        return commonAxios("post",`${Base.oldUrl}card/lossCard`, params)
    },
    //  退卡
    revokeSlaveCard(params) {
        return commonAxios("post",`${Base.oldUrl}card/revokeSlaveCard`, params)
    },
    //  补卡
    reissueSlaveCard(params) {
        return commonAxios("post",`${Base.oldUrl}card/reissueSlaveCard`, params)
    }
    /* -----------卡管理中心 END--------------- */
}
export default BasicInfo
