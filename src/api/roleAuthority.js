import { commonAxios } from '../utils/axios';
import Base from './base';

//  角色授权模块
const RoleAuthority = {
    /* -----------角色组设置 START--------------- */
    //  新增角色组
    addRole(params) {
        return commonAxios("post",`${Base.oldUrl}role/add`, params)
    },
    //  删除角色组
    delRole(params) {
        return commonAxios("get",`${Base.oldUrl}role/del`, params)
    },
    //  修改角色组
    editRole(params) {
        return commonAxios("post",`${Base.oldUrl}role/edit`, params)
    },
    //  保存权限
    optMatrix(params) {
        return commonAxios("post",`${Base.oldUrl}role/optMatrix`, params)
    },
    //  获取当前登录人的权限
    getUserActions(params) {
        return commonAxios("get",`${Base.oldUrl}role/getUserActions`, params)
    },
    //  获取所有角色组权限列表
    getAllRoleList(params) {
        return commonAxios("get",`${Base.oldUrl}role/allResource`, params)
    },
    //  获取角色拥有的权限
    getMatrixRole(params) {
        return commonAxios("get",`${Base.oldUrl}role/getMatrix`, params)
    },
    //  获取角色组列表
    getRoleList(params) {
        return commonAxios("get",`${Base.oldUrl}role/list`, params)
    },
    /* -----------角色组设置 END--------------- */


    /* -----------角色组成员设置 START--------------- */
    //  删除角色拥有成员
    unbindUser(params) {
        return commonAxios("post",`${Base.oldUrl}role/unbindUser`, params)
    },
    //  保存角色权限
    optManageInfoToUserList(params) {
        return commonAxios("post",`${Base.oldUrl}roleAuth/optManageInfoToUserList`, params)
    },
    //  查看用户可管理班级
    manageInfoByUser(params) {
        return commonAxios("get",`${Base.oldUrl}roleAuth/manageInfoByUser`, params)
    },
    //  获取角色组成员设置列表
    getUserList(params) {
        return commonAxios("post",`${Base.oldUrl}role/getUserList`, params)
    },
    //  获取指定成员
    getTeacherListAll(params) {
        return commonAxios("get",`${Base.oldUrl}userInfo/getTeacherListAll`, params)
    },
    //  修改人员密码
    modifyPwd(params) {
        return commonAxios("post",`${Base.oldUrl}account/modifyPwd`, params)
    }
    /* -----------角色组成员设置 END--------------- */
}
export default RoleAuthority