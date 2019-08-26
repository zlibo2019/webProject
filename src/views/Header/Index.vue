<template>
    <el-container class="index">
        <el-header class="m-top">
            <div class="mennu">
                <div class="top-left">
                    <span>威尔协同教育校云平台aqaaaaaaaaaa</span>
                </div>
                <div class="menu-div">
                    <ul>
                        <li v-for="(menu, index) in menuData" :key="index"
                            :style="{'flex-basis': `${100/menuData1.length }%`}" v-if="!menu.hid">
                            <span :class="{act: actMenu == menu.value}" @click="navClick(index, menu,$event)">{{ menu.title }}</span>
                        </li>
                    </ul>
                </div>
                <div class="top-right">
                    <div class="button-div">
                        <span class="phone">{{ userAccount }}</span>
                        <span @click="exitClick">退出</span>
                    </div>
                </div>
            </div>
            <div class="sub-menu" v-show="noSunmenu">
                <dl>
                    <dt v-for="(sub, sIndex) in subMenu" :key="sIndex"><!-- v-if="!sub.hid"-->
                        <span :class="{act: actSubMenu == sIndex}" @click="subClick(sIndex, sub)">{{ sub.title }}</span>
                    </dt>
                </dl>
            </div>
        </el-header>
        <el-main class="m-cen">
            <router-view v-if="isRouterAlive"></router-view>
        </el-main>
        <el-footer class="m-bom">
            <div class="b-left">山东威尔数据股份有限公司</div>
            <div class="b-right">0535-3971818</div>
        </el-footer>
        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </el-container>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'

	export default {
		name: 'index',
		components: {
			Button, Toast
		},
		data() {
			return {
				isRouterAlive: true, //路由是否加载
				actMenu: 0,//选择导航
				actSubMenu: 0,//选择二级导航
				noSunmenu:true,//是否有二级导航
				menuData: [],         //最终导航
				menuData1: [
					{
						title: '设备管理',
						value: 1,
						hid: false,
						submenus: [
							{
								title: '场所管理',
								value: 11,
							},{
								title: '添加设备',
								value: 12,
							},{
								title: '设备监控',
								value: 13,
							},{
								title: '设备规则',
								value: 14,
							}]
					},
					{
						title: '基础信息',
						value: 2,
						hid: false,
						submenus: [
                        {
							title: '学校档案',
							value: 21,
						},{
							title: '学生/家长档案',
							value: 23,
						}, {
                            title: '教职工档案',
                            value: 22,
                        },  {
							title: '卡管理中心',
							value: 24,
						},  {
							title: '人脸档案',
							value: 25,
						}]
					},
					{
						title: '教务管理',
						value: 7,
						hid: false,
						submenus: [
                        {
							title: '学年/学期管理',
							value: 71,
						},{
							title: '上课时间',
							value: 72,
						}, {
                            title: '课程管理',
                            value: 73,
                        },  {
							title: '选课走班',
							value: 74,
						}]
					},
					{
						title: '应用服务',
						value: 3,
						hid: false,
					},
					{
						title: '角色授权',
						value: 4,
						hid: false,
					},
					{
						title: '数据统计',
						value: 5,
						hid: false,
					},
					/* {
						title: '操作日志',
						value: 6,
						hid: false,
					} */
				],    //一级导航数据(管理员角色)
				menuData2: [
					{
						title: '基础信息',
						value: 2,
						hid: false,
						submenus: [
							
							{
								title: '学校档案',
								value: 21,
							},{
								title: '学生/家长档案',
								value: 23,
							}, {
								title: '教职工档案',
								value: 22,
							},  {
								title: '卡管理中心',
								value: 24,
							},  {
							title: '人脸档案',
							value: 25,
						}]
					},
					{
						title: '数据统计',
						value: 5,
						hid: false,
					},
				],    //一级导航数据(班主任角色)
				subMenu: [],        //二级导航数据
				UserName: sessionStorage.getItem('userName'),
				isToast: false,
				toast: '',
                userAccount: localStorage.getItem('phoneNo') ? localStorage.getItem('phoneNo') : '',   // 获取登录账号
			}
		},
		methods: {
			/**
			 * toast弹窗隐藏
			 * wzx
			 * 2018.7.18
			 */
			hideToast() {
				this.isToast = false;
			},
			/**
			 *  @function: 点击退出按钮
			 *  @author: lxr
			 *  @date 2018-7-9
			 **/
			exitClick() {
				let downZip = localStorage.getItem('downZip');
				let account = localStorage.getItem('account');
				sessionStorage.clear();//清除所有session
				localStorage.clear();//清除所有session
				localStorage.setItem('downZip',downZip);
				localStorage.setItem('account',account);
				this.$store.commit({
					type: 'SET_ROLEACTION_LIST',
					roleActions: []
				})
				this.$router.push('/')
			},
			/**
			 *  @function: 点击一级导航
			 *  @author: lxr
			 *  @date 2018-7-9
			 **/
			navClick(index, menuData, even) {
				let menuVal = menuData.value;
				this.actMenu = menuVal;
				
				//一级导航跳转路由
				
				if (menuVal == 1) {
                    console.log('index  1');
					this.$router.push('/DeviceControl')
				} else if (menuVal == 2) {                              //基础信息管理-默认跳转学校档案
					this.$router.push('/SchoolRecord')
				} else if (menuVal == 3) {                              //应用规则设置-默认跳转学生进出设置
					this.$router.push('/BuildingsDevices')            //框架首页
				} else if (menuVal == 4) {                             //高级设置-默认跳转权限分配--二期修改为角色授权
					// this.$router.push('/AdvancedSettings')     //框架首页
					this.$router.push('/RoleGroupSet')     //框架首页-默认跳转角色组设置
				} else if (menuVal == 5) {                             //数据统计-默认跳转学生每日进出
					this.$router.push('/StudentsTurnover')
				} else if (menuVal == 6) {                             // 二期添加操作日志导航
					this.$router.push('/OperationLog')
				} else if (menuVal == 7) {                             // 教务管理--学年学期管理
					this.$router.push('/TermManage')
				}
				this.subMenu = menuData.submenus;
				// console.log("subMenu:",this.subMenu)
				$(even.target).parents('.mennu').siblings('.sub-menu').height('0');
				$(even.target).parents('.mennu').css({'border-bottom': '0'});//阴影设置
				if (this.subMenu) {
					// console.log('this.subMenu',this.subMenu)
					this.actSubMenu = 0;
					if(menuVal == 1){//点击第一个导航二级显示第三个
						this.actSubMenu = 2;
					}
					sessionStorage.setItem('menuIndexSub', JSON.stringify(this.subMenu));//存session存住选中二级导航
					// 根据权限设置二级高度
					let isShow = [];
					$.each(this.subMenu, (i, sub)=>{
						isShow.push(sub.hid)
					})
					// console.log('isShow',isShow,this.subMenu)
					$(even.target).parents('.mennu').css({'border-bottom': '2px solid #fff'});//阴影设置
					if(isShow.indexOf(undefined) != -1){// 无权限功能
						$('.index > .m-top .sub-menu').css({'line-height': '5.3vh', 'height': '5.3vh'});       //设置二级高度
					}else{// 有权限功能
						if(isShow.indexOf(false) != -1){//有展示项
							$(even.target).parents('.mennu').siblings('.sub-menu').css({
								'line-height': '5.3vh',
								'height': '5.3vh'
							});
						}else {
							$(even.target).parents('.mennu').css({'border-bottom': '0'});//阴影设置
						}
					}
				} else {
					sessionStorage.setItem('menuIndexSub', JSON.stringify([]));//存session存住选中二级导航
				}
				this.isRouterAlive = false;                        //点击相同路由用来刷新页面
				this.$nextTick(() => (this.isRouterAlive = true));    //点击相同路由用来刷新页面
				$('.index > .m-cen').height($('.index').height() - $('.index > .m-top').height() - $('.index > .m-bom').height() - 20);//重新设置高度
				//存session存住选中导航
				sessionStorage.setItem('menuIndex', menuVal);
				//删除内容中存的导航session
				sessionStorage.removeItem('pageMenuIndex');
				sessionStorage.removeItem('childMenuIndex');
				//删除二级session
				let menuIndex = sessionStorage.getItem('menuIndex') ? (parseInt(sessionStorage.getItem('menuIndex')) + 1) : 0;
				let submenuTag = JSON.parse(sessionStorage.getItem('submenuTag'));
				if (!submenuTag) return;
				if ((menuIndex) != submenuTag.id) {//一级与二级统一
					sessionStorage.removeItem('submenuTag');//删除二级session
					sessionStorage.removeItem('submenuIndex');//删除二级session
				}
			},
			/**
			 *  @function: 点击二级导航
			 *  @author: lxr
			 *  @date 2018-7-9
			 **/
			subClick(index, sub) {
				let subVal = sub.value;
				this.actSubMenu = index;
				if (sub.value == 21) {
					this.$router.push('/SchoolRecord');//学校档案
				} else if (sub.value == 22) {
					this.$router.push('/TeachersRecord');//教职工档案
				} else if (sub.value == 23) {
					this.$router.push('/ParentsRecord');//学生/家长档案
				} else if (sub.value == 24) {
          this.$router.push('/CardManagement');//卡管理中心
        } else if (sub.value == 25) {
          this.$router.push('/FaceManagement');//人脸档案          
				} else if (sub.value == 11) {
					this.$router.push('/PlaceManage');//场所管理
				} else if (sub.value == 12) {
					this.$router.push('/AddDevice');//添加设备
				} else if (sub.value == 13) {
					this.$router.push('/DeviceControl');//设备监控
                    console.log('index  2');
				} else if (sub.value == 14) {
					this.$router.push('/DeviceRules');//设备规则
				} else if (sub.value == 71) {
					this.$router.push('/TermManage');//学年学期管理
				} else if (sub.value == 72) {
					this.$router.push('/ClassTime');//上课时间
				} else if (sub.value == 73) {
					this.$router.push('/CourseSubjects');//课程科目
				} else if (sub.value == 74) {
					this.$router.push('/SelectCourseManage');//走班课程管理
				}
				this.isRouterAlive = false;                        //点击相同路由用来刷新页面
				this.$nextTick(() => (this.isRouterAlive = true));    //点击相同路由用来刷新页面
				sessionStorage.setItem('submenuTag', JSON.stringify(sub));
				sessionStorage.setItem('submenuIndex', index);
				sessionStorage.removeItem('threeMenuIndex')
				sessionStorage.removeItem('pageMenuIndex')
				sessionStorage.removeItem('childMenuIndex')
			}
		},
		mounted() {
			// 获取角色权限(2期一放)
          /*  let roleLimit = '1,2,21,3,4,5,6';
			let roleLimitArr = roleLimit.split(',')
            $.each(this.menuData, (i, menu)=>{
                if(roleLimitArr.indexOf(menu.value.toString()) != -1){// 存在该权限就给hid属性赋值
                    menu.hid = false;// false是显示
                }else {
	                menu.hid = true;// false是隐藏
                }
	            /!*$.each(menu.submenus, (j, sub)=>{// 获取二级权限(2期一放)
		            if(roleLimitArr.indexOf(sub.value.toString()) != -1){// 存在该权限就给hid属性赋值
			            sub.hid = false;// false是显示
		            }else {
			            sub.hid = true;// true是隐藏
		            }
	            });*!/
            });*/
			// this.roleNos = ['SYS002'];  // 测试班主任角色
            // console.log('roleNos',this.roleNos.length)
            if(this.roleNos.length == 1 && this.roleNos[0] == 'SYS002'){ // 班主任
	            // console.log(1,this.roleNos.length , this.roleNos[0])
	            this.menuData = this.menuData1;
            }else{
	            this.menuData = this.menuData1;
            }
			// this.menuData = this.menuData1;
			//设置右侧内容高度
			setTimeout(() => {//必须加延迟获取dom节点
				$('.index > .m-cen').height($('.index').height() - $('.index > .m-top').height() - $('.index > .m-bom').height() - 20);
			})
			$('.index > .m-top .mennu').css('border-bottom', 0);//选中下划线样式问题
			let menuIndex = sessionStorage.getItem('menuIndex') ? (sessionStorage.getItem('menuIndex')) : 0;//一级导航
			let menuIndexSub = JSON.parse(sessionStorage.getItem('menuIndexSub'));//二级数据
			let submenuIndex = sessionStorage.getItem('submenuIndex') ? parseInt(sessionStorage.getItem('submenuIndex')) : 0;//二级导航
			// console.log('menuIndex-index',menuIndex)
			// console.log('menuIndexSub',menuIndexSub)
			// console.log('submenuIndex',submenuIndex)
			$('.index > .m-top .sub-menu').height('0');                                                  //设置二级高度
			$('.index > .m-top .mennu').css({'border-bottom': '0'});                                     //阴影设置
			if (menuIndex != 0) {                     //选中一级
				this.actMenu = menuIndex;           //添加选中样式
			} else{
				this.actMenu = this.menuData[0].value;//一级导航样式
				this.subMenu = this.menuData[0].submenus;												// 1220
				this.actSubMenu = 2;    																// 1220添加选中样式
				$('.index > .m-top .mennu').css({'border-bottom': '2px solid #fff'});                 	// 1220阴影设置
				$('.index > .m-top .sub-menu').css({'line-height': '5.3vh', 'height': '5.3vh'});        // 1220设置二级高度
				if(this.roleNos.length == 1 && this.roleNos[0] == 'SYS002'){ // 班主任
					this.$router.push('/SchoolRecord');
				}else{// 非班主任
					this.$router.push('/DeviceControl');
                    console.log('index  3');
                }
            }
			if (menuIndexSub != null) {
				if (menuIndexSub.length != 0) {           //有二级时
					this.subMenu = menuIndexSub;         //赋值二级数组
                    if(submenuIndex != 0){
	                    this.actSubMenu = submenuIndex;    //添加选中样式
                    }else{
	                    this.actSubMenu = 0;               //添加选中样式
                    }
                    // 根据权限设置二级高度
					let isShow = [];
					$.each(this.subMenu, (i, sub)=>{
						isShow.push(sub.hid)
					})
					// console.log('isShow',isShow,this.subMenu)
					$('.index > .m-top .mennu').css({'border-bottom': '2px solid #fff'});                 //阴影设置
					if(isShow.indexOf(undefined) != -1){// 无权限功能
						$('.index > .m-top .sub-menu').css({'line-height': '5.3vh', 'height': '5.3vh'});       //设置二级高度
					}else {// 有权限功能
						if(isShow.indexOf(false) != -1) {//有展示项
							$('.index > .m-top .sub-menu').css({'line-height': '5.3vh', 'height': '5.3vh'});       //设置二级高度
						}else {
							$('.index > .m-top .mennu').css({'border-bottom': '0'});                                     //阴影设置
						}
                    }
				}
			} else {
				// 班主任权限
				if(this.roleNos.length == 1 && this.roleNos[0] == 'SYS002'){ // 班主任
					this.subMenu = this.menuData[0].submenus;         //赋值二级数组
					// console.log(this.menuData)
                    this.actSubMenu = 0;
					this.$router.push('/SchoolRecord')
					$('.index > .m-top .mennu').css({'border-bottom': '2px solid #fff'});                 //阴影设置
					$('.index > .m-top .sub-menu').css({'line-height': '5.3vh', 'height': '5.3vh'});       //设置二级高度
				}else{  // 非班主任权限
					this.$router.push('/DeviceControl')
                    console.log('index  4');
                }
			}
			// console.log('this.actSubMenu',this.actSubMenu)
		},
		watch:{
			$route(to,from){
				console.log("从哪来，到哪去 Index",from.name,to.name);
				if(to.name == 'CardMonitor'){
					this.noSunmenu = false;
				}else{
					this.noSunmenu = true;
				}
			}
		},
		created(){
			// console.log(1111125,this.$route.name );
			if(this.$route.name == 'CardMonitor'){
				this.noSunmenu = false;
			}else{
				this.noSunmenu = true;
			}
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .index {
        height: 100%;
        width: 100%;
        overflow: hidden;

        > .m-top {
            width: 100%;
			height: auto !important;
			padding: 0;
            color: #fff;
            /*font-size: 1.7vh;*/
            font-size: 16px;
            border-bottom: 20px solid #E7E8EB;

            .mennu {
                display: flex;
                flex-direction: row;
                /*height: 6.7vh;*/
                line-height: 6.7vh;
                padding: 0 5vh;
                box-shadow: -2px 0 0 green, //左边阴影
                0 0px 0 blue, //顶部阴影
                0 1px 5px #D8D8DB, //底部阴影
                0 0 0 yellow; //右边阴影
                border-bottom: 2px solid #fff;
                .top-left {
                    flex: 1;
                    text-align: center;
                    span {
                        color: #333;
                    }
                }
                .menu-div {
                    flex: 3;
                    position: relative;
                    overflow: hidden;
                    ul {
                        display: flex;
                        justify-content: flex-end;// flex下右浮动
                    }
                    li {
                        display: inline-block;
                        color: #333;
                        text-align: right;
                        span {
                            display: inline-block;
                            border-bottom: 4px solid #fff;
                            padding: 0 5px;
                            cursor: pointer;
                            &.act {
                                color: #1cab7d;
                                border-bottom: 4px solid #1cab7d;
                            }
                        }
                    }
                }
                .top-right {
                    flex: 1;
                    font-size: 14px;
                    text-align: center;
                    .button-div {
                        background: transparent;
                        color: #333;
                        span {
                            cursor: pointer;
                        }
                    }
                    .add-btn {
                        background: transparent;
                        color: #333;
                        height: 100%;
                        line-height: 150%;
                        text-shadow: none; //修改样式必选项目
                        box-shadow: none; //修改样式必选项目
                        font-weight: normal; //修改样式必选项目
                        border-radius: 2px;
                        border: 0;

                        img {
                            width: 20px;
                            height: 20px;
                        }
                    }
                    .add-btn:hover {
                    }
                    .phone{
                        margin-right: 5%;font-size: 13px;
                    }
                }
            }
            .sub-menu {
                height: 0;
                color: #333;
                overflow: hidden;
                background: #F6F8FA;
                font-size: 14px;
                box-shadow: -2px 0 0 green, //左边阴影
                0 0px 0 blue, //顶部阴影
                0 1px 5px #D8D8DB, //底部阴影
                0 0 0 yellow; //右边阴影
                dl {
                    text-align: center;
                    dt {
                        display: inline-block;
                        width: 15%;
                        span {
                            cursor: pointer;
                            &.act {
                                color: #1cab7d;
                            }
                        }
                    }
                }
            }
        }
        > .m-cen {
            width: 100%;
            padding: 0;
        }
        > .m-bom {
            background: #E7E8EB;
            height: 5vh !important;
            padding: 0;
            width: 100%;
            line-height: 5vh;
            display: flex;
            font-size: 12px;
            .b-left {
                flex: 1;
                text-align: left;
                padding-left: 5%;
            }
            .b-right {
                flex: 1;
                text-align: right;
                padding-right: 2%;
            }
        }
    }
</style>
