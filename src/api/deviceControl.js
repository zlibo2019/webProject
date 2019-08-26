import { commonAxios } from '../utils/axios';
import Base from './base';

// 设备监控模块
const DeviceControl = {
    /* -----------设备监控 START--------------- */
    //  获取区域列表
    getBuildList(params) {
        return commonAxios("post",`${Base.oldUrl}devPlace/getBuildList`, params)
    },
    //  获取设备状态 原来
    // getDevList(params) {
    //     return commonAxios("post",`${Base.oldUrl}dev/getDevList`, params)
    // },
    //  获取设备监控设备列表 
    getDevList(type,params) {
        return commonAxios(type,`${Base.bd}api/web/devicemonitor`, params)
    },
    //  查看班牌监控 
    getCardMonitor(type,params) {
        return commonAxios(type,`${Base.bd}api/notification/screen_shot`, params)
    },
    /* -----------设备监控 END--------------- */

    /* -----------添加设备 START--------------- */
    // //  获取添加设备--表格数据
    // getChooseDeviceList(params) {
    //     return commonAxios("post",`${Base.oldUrl}SchoolTable`, params)
    // },
    //  获取选择设备--表格数据
    getChooseDeviceList(type,params) {
        return commonAxios(type,`${Base.bd}api/web/devicelist`, params)
    },
    //  获取设备表格数据
    getSchoolDeviceTable(type,params) {
        return commonAxios(type,`${Base.bd}api/dev/info`, params)
    },
    //  获取场所管理表格数据
    getPlaceTable(params) {
        return commonAxios("post",`${Base.oldUrl}PlaceTable`, params)
    },
    //  添加修改班牌设备
    addEditCardDevice(type,params) {
        return commonAxios(type,`${Base.bd}api/device/register`, params)
    },
    /* -----------添加设备 END--------------- */

    /* -----------场所管理 START--------------- */
    //  场所管理--表格数据
    getPlaceManageTableList(type,params) {
        return commonAxios(type,`${Base.bd}api/web/place/app`, params)
    },

    // url id(type,params,id) {
    //     return commonAxios(type,`${Base.bd}${id?"api/web/place/app?"+id:"api/web/place/app"}`, params)
    // },

    //  场所树相关
    addPlaceTree(type,params,id) {
        return commonAxios(type,`${Base.bd}api/web/dept/place${id?'/'+id:''}`, params)
        // return commonAxios(type,`${Base.bd}api/dev/place`, params)
    },
    //  场所树二级下拉列表
    placeLevel2(type,params) {
        return commonAxios(type,`${Base.bd}api/web/place/level2`, params)
    },
    //  验证场所是否重复
    checkPlaceName(type,params) {
        return commonAxios(type,`${Base.bd}api/place/name`, params)
    },
    //  设备场所关系
    devicePlaceRelation(type,params) {
        return commonAxios(type,`${Base.bd}api/web/device/place`, params)
    },
    /* -----------场所管理 END--------------- */
}
export default DeviceControl