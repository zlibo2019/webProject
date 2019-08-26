import { commonAxios } from '../utils/axios';
import Base from './base';

// 公共接口
const Common = {
    //  获取七牛token接口
    getQiniuUploadToken(params) {
        return commonAxios("get",`${Base.oldUrl}userInfo/getQiniuUploadToken`, params)
    },
    //  上传到七牛
    uploadQiniu(params) {
        return commonAxios("post","https://upload.qiniup.com/", params)
    },
    //  获取教职工组织结构
    getTreeListTeacher(params) {
        return commonAxios("post",`${Base.oldUrl}dept/staff`, params)
    },
    //  获取班级组织结构
    getTreeListStudent(params) {
        return commonAxios("post",`${Base.oldUrl}dept/class`, params)
    },
    //  获取授权学生组织架构
    getStudentList(params) {
        return commonAxios("post",`${Base.oldUrl}dept/classUser`, params)
    },
    //  获取字典
    // getDictionary(params) {
    //     return commonAxios("post","dept/classUser`, params)
    // },
    //  获取组织结构 node
    getPlaceTree(type,params) {
        return commonAxios(type,`${Base.bd}api/place/tree`, params)
    },
}
export default Common
