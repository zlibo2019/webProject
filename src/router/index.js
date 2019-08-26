import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/views/Login/Login'
import ClassSelectionNavSet from '@/views/EducationManage/ClassSelection/ClassSelectionNavSet'
Vue.use(Router)
const router = new Router({
	routes: [
		{
			path: '/',
			name: 'ClassSelectionNavSet',
			component: ClassSelectionNavSet
		},
		{
			path: '/Index',
			name: 'Index',
			component: () => import('@/views/Header/Index'),
			children: [{
				path: '/DeviceControl',
				name: 'DeviceControl',
				component: () => import('@/views/DeviceControl/DeviceControl')
			},{
				path: '/PlaceManage',
				name: 'PlaceManage',
				component: () => import('@/views/DeviceControl/PlaceManage'),
			},{
				path: '/CardMonitor',
				name: 'CardMonitor',
				component: () => import('@/views/DeviceControl/CardMonitor')
			},{
				path: '/DeviceRules',
				name: 'DeviceRules',
				component: () => import('@/views/DeviceControl/DeviceRules')
			},{
				path: '/DeviceDeployNav',
				name: 'DeviceDeployNav',
				component: () => import('@/views/DeviceControl/DeviceDeploy/DeviceDeployNav'),
				children:[
					{
						path: '/AddDevice',
						name: 'AddDevice',
						component: () => import('@/views/DeviceControl/DeviceDeploy/AddDevice')
					}, {
						path: '/VideoMonitoring',
						name: 'VideoMonitoring',
						component: () => import('@/views/DeviceControl/DeviceDeploy/VideoMonitoring')
					}
				]
			}, {
				path: '/SchoolRecord',
				name: 'SchoolRecord',
				component: () => import('@/views/BasicInfo/SchoolRecord')
			}, {
				path: '/TeachersRecord',
				name: 'TeachersRecord',
				component: () => import('@/views/BasicInfo/TeachersRecord')
			}, {
				path: '/ParentsRecord',
				name: 'ParentsRecord',
				component: () => import('@/views/BasicInfo/ParentsRecord')
			}, {
				path: '/CardManagement',
				name: 'CardManagement',
				component: () => import('@/views/BasicInfo/CardManagement')
			},{
			  path: '/FaceManagement',
        name: 'FaceManagement',
        component: () => import('@/views/BasicInfo/FaceManagement')
      }, {
				path: '/TermNavSet',
				name: 'TermNavSet',
				component: () => import('@/views/EducationManage/TermManage/TermNavSet'),
				children: [{
					path: '/SchoolCalendar',
					name: 'SchoolCalendar',
					component: () => import('@/views/EducationManage/TermManage/SchoolCalendar')
				},{
					path: '/TermManage',
					name: 'TermManage',
					component: () => import('@/views/EducationManage/TermManage/TermManage')
				}]
			},{
				path: '/ClassTime',
				name: 'ClassTime',
				component: () => import('@/views/EducationManage/ClassTime/ClassTime'),
			},{
				path: '/CourseNavSet',
				name: 'CourseNavSet',
				component: () => import('@/views/EducationManage/CourseManage/CourseNavSet'),
				children: [{
					path: '/CourseSubjects',
					name: 'CourseSubjects',
					component: () => import('@/views/EducationManage/CourseManage/CourseSubjects')
				},{
					path: '/TeacherTeaching',
					name: 'TeacherTeaching',
					component: () => import('@/views/EducationManage/CourseManage/TeacherTeaching')
				},{
					path: '/LayoutCourseYear',
					name: 'LayoutCourseYear',
					component: () => import('@/views/EducationManage/CourseManage/LayoutCourseYear')
				},{
					path: '/LayoutCourseTerm',
					name: 'LayoutCourseTerm',
					component: () => import('@/views/EducationManage/CourseManage/LayoutCourseTerm')
				}]
			},{
				path: '/ClassSelectionNavSet',
				name: 'ClassSelectionNavSet',
				component: () => import('@/views/EducationManage/ClassSelection/ClassSelectionNavSet'),
				children: [{
					path: '/SelectCourseManage',
					name: 'SelectCourseManage',
					component: () => import('@/views/EducationManage/ClassSelection/SelectCourseManage')
				},{
					path: '/SelectStudentManage',
					name: 'SelectStudentManage',
					component: () => import('@/views/EducationManage/ClassSelection/SelectStudentManage')
				},{
					path: '/SelectCourseYear',
					name: 'SelectCourseYear',
					component: () => import('@/views/EducationManage/ClassSelection/SelectCourseYear')
				},{
					path: '/SelectCourseTerm',
					name: 'SelectCourseTerm',
					component: () => import('@/views/EducationManage/ClassSelection/SelectCourseTerm')
				}]
			},{
				path: '/RulesIndex',
				name: 'RulesIndex',
				component: () => import('@/views/Rules/RulesIndex'),
				children: [{
					path: '/StuTurnoverSet',
					name: 'StuTurnoverSet',
					component: () => import('@/views/Rules/SchoolDoorSetting/StuTurnoverSet'),
					children: [{
						path: '/BuildingsDevices',
						name: 'BuildingsDevices',
						component: () => import('@/views/Rules/SchoolDoorSetting/BuildingsDevices')
					}, {
						path: '/StuRuleTime',
						name: 'StuRuleTime',
						component: () => import('@/views/Rules/SchoolDoorSetting/StuRuleTime')
					}, {
						path: '/StudentAccess',
						name: 'StudentAccess',
						component: () => import('@/views/Rules/SchoolDoorSetting/StudentAccess')
					}]
				}, {
					path: '/VisitorTurnoverSet',
					name: 'VisitorTurnoverSet',
					component: () => import('@/views/Rules/VisitorSetting/VisitorTurnoverSet'),
					children: [{
						path: '/VisitorDevices',
						name: 'VisitorDevices',
						component: () => import('@/views/Rules/VisitorSetting/VisitorDevices')
					}]
				}, {
					path: '/VisitorPass',
					name: 'VisitorPass',
					component: () => import('@/views/Rules/VisitorSetting/VisitorPass')
				},{
					path: '/SmartCardSet',
					name: 'SmartCardSet',
					component: () => import('@/views/Rules/SmartCard/SmartCardSet'),
					children: [{
						path: '/TemplateManage',
						name: 'TemplateManage',
						component: () => import('@/views/Rules/SmartCard/TemplateManage')
					}, {
						path: '/ResourcePic',
						name: 'ResourcePic',
						component: () => import('@/views/Rules/SmartCard/ResourcePlatform/ResourcePic')
					}, {
						path: '/ResourceVideo',
						name: 'ResourceVideo',
						component: () => import('@/views/Rules/SmartCard/ResourcePlatform/ResourceVideo')
					}, {
						path: '/ResourceWord',
						name: 'ResourceWord',
						component: () => import('@/views/Rules/SmartCard/ResourcePlatform/ResourceWord')
					},
					 {
						path: '/ApplicationRuleSet',
						name: 'ApplicationRuleSet',
						component: () => import('@/views/Rules/SmartCard/ApplicationRules/ApplicationRuleSet'),
						children:[
							{
								path: '/ContentSetting',
								name: 'ContentSetting',
								component: () => import('@/views/Rules/SmartCard/ApplicationRules/ContentSetting')
							}, {
								path: '/PlayRuleSetting',
								name: 'PlayRuleSetting',
								component: () => import('@/views/Rules/SmartCard/ApplicationRules/PlayRuleSetting')
							}, {
								path: '/PwdSetting',
								name: 'PwdSetting',
								component: () => import('@/views/Rules/SmartCard/ApplicationRules/PwdSetting')
							}
						]
					},
					// {
					// 	path: '/ContentSetting',
					// 	name: 'ContentSetting',
					// 	component: () => import('@/views/Rules/SmartCard/ApplicationRules/ContentSetting')
					// }, {
					// 	path: '/PlayRuleSetting',
					// 	name: 'PlayRuleSetting',
					// 	component: () => import('@/views/Rules/SmartCard/ApplicationRules/PlayRuleSetting')
					// }
				]
				},{
					path: '/PicListDetail',
					name: 'PicListDetail',
					component: () => import('@/views/Rules/SmartCard/ResourcePlatform/PicListDetail')
				},{
					path: '/VideoListDetail',
					name: 'VideoListDetail',
					component: () => import('@/views/Rules/SmartCard/ResourcePlatform/VideoListDetail')
				},{
					path: '/WordListDetail',
					name: 'WordListDetail',
					component: () => import('@/views/Rules/SmartCard/ResourcePlatform/WordListDetail')
				},{
					path: '/WordDetail',
					name: 'WordDetail',
					component: () => import('@/views/Rules/SmartCard/ResourcePlatform/WordDetail')
				},{
					path: '/UploadWord',
					name: 'UploadWord',
					component: () => import('@/views/Rules/SmartCard/ResourcePlatform/UploadWord')
				}
			]
			}, {
				path: '/RoleIndex',
				name: 'RoleIndex',
				component: () => import('@/views/RoleAuthority/RoleIndex'),
				children: [{
					path: '/RoleMemberSet',
					name: 'RoleMemberSet',
					component: () => import('@/views/RoleAuthority/RoleMemberSet')
				}, {
					path: '/RoleGroupSet',
					name: 'RoleGroupSet',
					component: () => import('@/views/RoleAuthority/RoleGroupSet')
				}]
			}, {
				path: '/DataReport',
				name: 'DataReport',
				component: () => import('@/views/DataCount/DataReport'),
				children: [{
					path: '/StudentsTurnover',
					name: 'StudentsTurnover',
					component: () => import('@/views/DataCount/StudentsTurnover')
				}, {
					path: '/StuLeaveRecord',
					name: 'StuLeaveRecord',
					component: () => import('@/views/DataCount/StuLeaveRecord')
				}, {
					path: '/VisitorTurnover',
					name: 'VisitorTurnover',
					component: () => import('@/views/DataCount/VisitorTurnover')
				}, {
					path: '/NoticeRecord',
					name: 'NoticeRecord',
					component: () => import('@/views/DataCount/NoticeRecord')
				}, {
					path: '/QuitRecord',
					name: 'QuitRecord',
					component: () => import('@/views/DataCount/QuitRecord')
				},{
                    path: '/TimeTableSet',
					name: 'TimeTableSet',
					component: () => import('@/views/DataCount/TimeTable/TimeTableSet'),
					children: []
                },{
                    path: '/ScheduleMonitor',
                    name: 'ScheduleMonitor',
                    component: () => import('@/views/DataCount/TimeTable/ScheduleMonitor')
                }, {
                    path: '/PlaceTimeTable',
                    name: 'PlaceTimeTable',
                    component: () => import('@/views/DataCount/TimeTable/PlaceTimeTable')
                }, {
                    path: '/TeacherTimeTable',
                    name: 'TeacherTimeTable',
                    component: () => import('@/views/DataCount/TimeTable/TeacherTimeTable')
                }, {
                    path: '/ClassTimeTable',
                    name: 'ClassTimeTable',
                    component: () => import('@/views/DataCount/TimeTable/ClassTimeTable')
                }]   
			}, {
				path: '/OperationLog',
				name: 'OperationLog',
				component: () => import('@/views/RecordLog/OperationLog')
			}]
		}
	]
})
export default router;
