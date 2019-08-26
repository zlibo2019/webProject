import Mock from 'mockjs'

// 获取 mock.Random 对象
const Random = Mock.Random;

// 校门进出表格数据
export const SchoolTable = req =>{
    let data = {};
    data = Mock.mock({
        'rows|20': [{
            'index|+1': 1,
            buildingName:'教学楼A',
            classroomName:101,
            deviceName:'智慧班牌',
            deviceId: Random.natural(),
            bindingClass:'初一 一班',
            classShowName: '初一 一班',
            openRuleName:'常开规则',
            openTimeName:'上课时间',
            openWeek:'周一、周二、周三、周四',
            openTime:'7:00-9:00',
            openTimeRange:'2018.9.1-2018.10.1',
            closeRuleName:'常开规则',
            closeTimeName:'上课时间',
            closeWeek:'周一、周二、周三、周四',
            closeTime:'7:00-9:00',
            closeTimeRange:'2018.9.1-2018.10.1',
        }]
    });
    data.count = data.rows.length;
    data.code = 0;
    data.msg = '成功';
    return data;
}
//校门进出设备table
export const SchoolDeviceTable = req =>{
    let data = {};
    data = Mock.mock({
        'data|3-10': [{
            'index|+1': 1,
            deviceName:'教学楼A',
            deviceId:101,
            deviceIp:'智慧班牌',
            isUsed:'初一 一班',
        }]
    });
    data.code = 0;
    data.msg = '成功';
    return data;
}
//校门进出设备table
export const PlaceTable = req =>{
    let data = {};
    data = Mock.mock({
        'data|3-10': [{
            'index|+1': 1,
            dic_type:'智慧班牌',
            room_name:'初一一班教室',
            dev_state:'0',
            place_name:'教学楼A',
            aisleName:'0',
        }]
    });
    data.total_record = data.data.length;
    data.code = 0;
    data.msg = '成功';
    return data;
}

//获取获取学年学期下拉列表
export const Semesterlist= req =>{
    let data = {};
    data = Mock.mock({
        'data|5': [{
            'code|+1': 2017,
            yearName:'2018-2019学年',
            isCreated:'1'
        }]
    });
    data.data = [];
    for (let i = 0; i < 5; i++) {
        data.data.push(Mock.mock({
            'code': 2017+i,
            yearName:Random.ctitle(3, 6),
            isCreated:i%2
        }))
    }
    console.log(data.data);
    
    data.code = 0;
    data.msg = '成功';
    return data;
}
//获取学年学期信息
export const Semester= req =>{
    let data = {};
    data = Mock.mock({
        'data|20': [{
            'index|+1': 1,
            'id|+1': 1,
            'yearid|+1': '1',
            'semesterid|+1': 1,
            yearName:'2018-2019学年',
            semesterName:'第一学期',
            startDate:Random.date(),
            endDate:Random.date(),
            createDate:Random.date(),
            creator:Random.cname(),
        }]
    });
    data.total_record = data.data.length;
    data.code = 0;
    data.msg = '成功';
    return data;
}

//获取上课时间信息
export const Lessontime = req =>{
    let data = {};
    data = Mock.mock({
        'data|20': [{
            'index|+1': 1,
            'timeid|+1': 1,
            timeName:Random.ctitle(),
            startDate:Random.date(),
            endDate:Random.date(),
            classRooms:Random.ctitle(),
            createDate:Random.date(),
            creator:Random.cname(),
        }]
    });
    data.total_record = data.data.length;
    data.code = 0;
    data.msg = '成功';
    return data;
}

//获取课程信息
export const Course = req =>{
    let data = {};
    data = Mock.mock({
        'data|20': [{
            'index|+1': 1,
            'id|+1': 1,
            name:Random.ctitle(),
            remarks:Random.cparagraph(),
        }]
    });
    data.total_record = data.data.length;
    data.code = 0;
    data.msg = '成功';
    return data;
}
