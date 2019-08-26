import { commonAxios, geturlPost, deleteAxios } from '../utils/axios';
import Base from './base';

// 应用服务模块
const Rules = {
    /* -----------校门口进出管理 START--------------- */
                //------楼宇/设备------//
    //  获取该楼宇下是否有设备
    beforeDeletePlace(params) {
        
        return commonAxios("post",`${Base.oldUrl}devPlace/beforeDeletePlace`, params)
    },
    //  获取楼宇数据------1.校门口楼宇/设备 2.访客楼宇/设备
    getBuildList(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/getBuildList`, params)
    },
    //  删除楼宇------1.校门口楼宇/设备 2.访客楼宇/设备
    deletePlace(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/deletePlace`, params)
    },
    //  新增楼宇------1.校门口楼宇/设备 2.访客楼宇/设备
    addPlace(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/addPlace`, params)
    },
    //  修改楼宇------1.校门口楼宇/设备 2.访客楼宇/设备
    updatePlace(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/updatePlace`, params)
    },
    //  删除通道
    deleteInoutDev(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/deleteInoutDev`, params)
    },
    //  新增通道
    addInoutDev(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/addInoutDev`, params)
    },
    //  修改通道
    updateInoutDev(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/updateInoutDev`, params)
    },
    //  根据楼宇查询通道设备数据
    selectInoutList(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/selectInoutList`, params)
    },
    //  根据楼宇查询通道设备数据
    selectCameraList(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/selectCameraList`, params)
    },
    //  删除摄像头
    deleteCameraList(params) {
        return geturlPost(`${Base.oldUrl}devPlace/deleteCameraList`, params)
    },
    //  新增摄像头
    addCamera(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/addCamera`, params)
    },
    //  修改摄像头
    updateCameraList(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/updateCameraList`, params)
    },
    //  获取摄像头关联方向
    getCameraFx(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/relaFx`, params)
    },
    //  获取摄像头类型
    getCameraType(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/cameraType`, params)
    },
    //  1.校门口楼宇/设备--获取门控道闸/考勤一体机数据 2.访客楼宇/设备--获取门卫/来访数据
    selectDevList(params) {
        return commonAxios("post",`${Base.oldUrl}dev/selectDevList`, params)
    },
    //  获取门接口数据
    selectLock(params) {
        return commonAxios("post",`${Base.oldUrl}dev/selectLock`, params)
    },
                //------学生进出权限------//
    //  获取规则列表
    getRuleList(params) {
        return geturlPost(`${Base.oldUrl}devPlace/getRuleList`, params)
    },
    //  获取授权通道
    getDevBind(params) {
        return geturlPost(`${Base.oldUrl}devPlace/getDevBind`, params)
    },
    //  获取已授权学生列表
    getRuleUsers(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/getRuleUsers`, params)
    },
    //  获取学生进出权限table列表
    getInoutUser(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/getInoutUser`, params)
    },
    //  删除规则
    deleteRuleUser(params) {
        return geturlPost(`${Base.oldUrl}devPlace/deleteRuleUser`, params)
    },
    //  规则授权保存按钮
    saveRule(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/saveRule`, params)
    },
                //------进出时段规则------//
    //  删除规则
    deleteInoutRule(params) {
        return geturlPost(`${Base.oldUrl}devPlace/deleteInoutRule`, params)
    },
    //  新建规则
    addInoutRule(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/addInoutRule`, params)
    },
    //  修改规则
    updateInoutRule(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/updateInoutRule`, params)
    },
    //  新增时段规则
    addInoutTime(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/addInoutTime`, params)
    },
    //  修改时段规则
    updateInoutTime(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/updateInoutTime`, params)
    },
    //  获取时段规则详情
    getInoutTimeDetail(params) {
        return geturlPost(`${Base.oldUrl}devPlace/getInoutTimeDetail`, params)
    },
    //  删除时段规则
    deleteInoutTime(params) {
        return geturlPost(`${Base.oldUrl}devPlace/deleteInoutTime`, params)
    },
    //  获取规则列表数据
    getInoutTime(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/getInoutTime`, params)
    },
    /* -----------校门口进出管理 END--------------- */

    /* -----------访客进出管理 START--------------- */
                //------访客通行证------//
    //  获取访客列表数据
    cycleList(params) {
        return commonAxios("post",`${Base.oldUrl}visitor/cycleList`, params)
    },
    //  添加/修改访客通行证
    cycleSave(params) {
        return commonAxios("post",`${Base.oldUrl}visitor/cycleSave`, params)
    },
    //  删除访客通行证
    cycleDelete(params) {
        return commonAxios("get",`${Base.oldUrl}visitor/cycleDelete`, params)
    },
                //------访客楼宇/设备------//
    //  获取该楼宇下是否有设备
    beforeDeletePlace(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/beforeDeletePlace`, params)
    },
    //  新增通道设备
    addVisitorDev(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/addVisitorDev`, params)
    },
    //  修改通道设备
    modifyVisitorDev(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/modifyVisitorDev`, params)
    },
    //  删除通道设备
    deleteVisitorDev(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/deleteVisitorDev`, params)
    },
    //  获取通道设备
    selectVisitorDev(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/selectVisitorDev`, params)
    },
    /* -----------访客进出管理 END--------------- */

    /* -----------应用规则 START--------------- */
                //------班牌内容设置------//
    //班牌内容设置列表相关 修改
    contentSetList(type,params,id) {
        return commonAxios(type,`${Base.bd}api/web/rule/classdev${id?'?id='+id:''}`, params)
    },
    //班牌内容设置详细
    contentDetail(type,params) {
        return commonAxios(type,`${Base.bd}api/web/rule/classdev/one`, params)
    },
    //获取新闻来源
    getNewsFrom(type,params) {
        return commonAxios(type,`${Base.bd}api/web/news/from`, params)
    },
                //------播放规则设置------//
    //播放规则设置列表
    palyRuleList(type,params,id) {
        return commonAxios(type,`${Base.bd}api/web/rule/classrule${id?'?id='+id:''}`, params)
    },
    //获取规则详细
    getPalyRuleDetail(type,params) {
        return commonAxios(type,`${Base.bd}api/web/rule/classrule/ruleid`, params)
    },
    /* -----------应用规则 END--------------- */


    /* -----------模板管理 START--------------- */
    //获取模板列表
    getDevTemplate(type,params) {
        return commonAxios(type,`${Base.bd}api/web/dev/template`, params)
    },
    //应用模板
    // applyTemplate(type,params) {
    //     return commonAxios(type,`${Base.bd}api/web/class/template`, params)
    // },
    //下发模板
    applyTemplate(type,params) {
        return commonAxios(type,`${Base.bd}api/template/change`, params)
    },
    /* -----------模板管理 END--------------- */


    /* -----------资源平台 START--------------- */
    //获取资源标签列表
    getResourcesLabels(type,params) {
        return commonAxios(type,`${Base.bd}api/resource/labels`, params)
    },
    //获取各种资源总数
    getLabelCount(type,params) {
        return commonAxios(type,`${Base.bd}api/resource/label/count`, params)
    },
    //获取本人创建的资源标签列表
    getUserLabels(type,params) {
        return commonAxios(type,`${Base.bd}api/resource/mylabels`, params)
    },
    //新增修改资源标签
    modifyLabel(type,params) {
        return commonAxios(type,`${Base.bd}api/resource/label`, params)
    },
    //删除资源标签
    delLabel(params) {
        return deleteAxios(`${Base.bd}api/resource/label`, params)
    },
    //获取资源列表
    getResources(type,params) {
        return commonAxios(type,`${Base.bd}api/resources`, params)
    },
    //获取已发布资源列表
    getPublishedResources(type,params) {
        return commonAxios(type,`${Base.bd}api/resource/published`, params)
    },
    //获取未发布资源列表
    getUnpublishedResources(type,params) {
        return commonAxios(type,`${Base.bd}api/resource/unpublished`, params)
    },
    //发布资源
    publishResource(type,params) {
        return commonAxios(type,`${Base.bd}api/resource/publish`, params)
    },
    //取消发布资源
    unPublishResource(type,params) {
        return commonAxios(type,`${Base.bd}api/resource/unpublish`, params)
    },
    //更新资源资源
    putResource(type,params) {
        return commonAxios(type,`${Base.bd}api/resource`, params)
    },
    //删除资源
    delResource(params) {
        return deleteAxios(`${Base.bd}api/resource`, params)
    },
    //上传资源
    addResource(type,params) {
        return commonAxios(type,`${Base.bd}api/resource/add`, params)
    },
    /* -----------资源平台 END--------------- */
}
export default Rules
