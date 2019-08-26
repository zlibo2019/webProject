<template>
    <div class="center-box date-report">
        <div class="center-left" ref="abc">
            <NavMenu :data="menuData" blocks="block" dtPLeft="padding-left: 70px; font-size:14px;" menuStyle="menuStyle" 
                     @click="clickMenu" actives="actives" :clickActive1="clickActive1" :clickActive2="clickActive2"></NavMenu>
        </div>
        <div class="center-right">
            <div class="right-center">
                <router-view v-if="isRouterAlive"></router-view>
            </div>
            <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
        </div>
    </div>
</template>

<script>
	import NavMenu from '@/components/NavMenu/NavMenu'
	import Toast from '@/components/Toast/Toast'

	export default {
		name: 'DataReport',
		components: {
			 NavMenu, Toast
		},
		data() {
			return {
				userNo: localStorage.getItem('userNo') ? localStorage.getItem('userNo') : '',
				isRouterAlive: true, //路由是否加载
				menuData: [
					{
						title: '学生进出记录',
						value: 1,
						isSubShow: false,
						icon: require('../../assets/images/report_d01.png'),
						iconActive: require('../../assets/images/report_s01.png')
					},
					{
						title: '学生请假记录',
						value: 2,
						isSubShow: false,
						icon: require('../../assets/images/report_d05.png'),
						iconActive: require('../../assets/images/report_s05.png')
					},
					{
						title: '访客来访记录',
						value: 3,
						isSubShow: false,
						icon: require('../../assets/images/report_d02.png'),
						iconActive: require('../../assets/images/report_s02.png')
					},
					{
						title: '发布通知记录',
						value: 4,
						isSubShow: false,
						icon: require('../../assets/images/report_d03.png'),
						iconActive: require('../../assets/images/report_s03.png')
					},
					{
						title: '离校/离职档案',
						value: 5,
						isSubShow: false,
						icon: require('../../assets/images/report_d04.png'),
						iconActive: require('../../assets/images/report_s04.png')
					},
					{
						title: '课程表查询',
						value: 6,
						isSubShow: true,
						icon: require('../../assets/images/report_d04.png'),
                        iconActive: require('../../assets/images/report_s04.png'),
                        submenus: [{
							title: '课表监控',
							value: 61,
						}, {
							title: '班级/教室课表',
							value: 62,
						}, {
							title: '教师课表',
							value: 63,
						}, {
							title: '学生课表',
							value: 64,
						}]
					}
				],
				isToast: false,
				toast: '',
				clickActive1: sessionStorage.getItem('pageMenuIndex')?sessionStorage.getItem('pageMenuIndex'): 0,
				clickActive2: sessionStorage.getItem('threeMenuIndex')?sessionStorage.getItem('threeMenuIndex')-1: -1,
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
			clickMenu(index, item) {
				console.log('clickMenu', index, item)
                sessionStorage.removeItem('childMenuIndex');// 点击左侧菜单删除右上菜单的session，避免样式去不掉180906(点击二级，不能放外面)
                sessionStorage.setItem('pageMenuIndex',index);
				if (item.value == 1) {
					this.$router.push('/StudentsTurnover')      //学生进出
                    sessionStorage.removeItem('threeMenuIndex');
                    this.clickActive2 = -1;
				} else if (item.value == 2) {
					this.$router.push('/StuLeaveRecord')        //学生请假
                    sessionStorage.removeItem('threeMenuIndex');
                    this.clickActive2 = -1;
				} else if (item.value == 3) {
					this.$router.push('/VisitorTurnover')       //访客进出
                    sessionStorage.removeItem('threeMenuIndex');
                    this.clickActive2 = -1;
				} else if (item.value == 4) {
					this.$router.push('/NoticeRecord')          //发布通知
                    sessionStorage.removeItem('threeMenuIndex');
                    this.clickActive2 = -1;
				} else if (item.value == 5) {
					this.$router.push('/QuitRecord')            //离校离职
                    sessionStorage.removeItem('threeMenuIndex');
                    this.clickActive2 = -1;
				} else if (item.value == 6) {
                    if(sessionStorage.getItem('threeMenuIndex') != null){
                        this.clickActive2 = sessionStorage.getItem('threeMenuIndex')-1; 
                    }else{
                        this.clickActive2 = -1;
                    }
                    return
				} else if (item.value == 61) {
                    this.$router.push('/ScheduleMonitor')       //课程表查询 -- 课表监控
                    sessionStorage.setItem('pageMenuIndex',parseInt(item.value/10)-1);
                    sessionStorage.setItem('threeMenuIndex',parseInt(item.value%10));
				} else if (item.value == 62) {
					this.$router.push('/PlaceTimeTable')            //班级/教室课表
                    sessionStorage.setItem('pageMenuIndex',parseInt(item.value/10)-1);
                    sessionStorage.setItem('threeMenuIndex',parseInt(item.value%10));
				}else if (item.value == 63) {
					this.$router.push('/TeacherTimeTable')          //教师课表
                    sessionStorage.setItem('pageMenuIndex',parseInt(item.value/10)-1);
                    sessionStorage.setItem('threeMenuIndex',parseInt(item.value%10));
				}else if (item.value == 64) {
					this.$router.push('/ClassTimeTable')          //学生课表
                    sessionStorage.setItem('pageMenuIndex',parseInt(item.value/10)-1);
                    sessionStorage.setItem('threeMenuIndex',parseInt(item.value%10));
                }
                this.isRouterAlive = false;                        //点击相同路由用来刷新页面
                this.$nextTick(() => (this.isRouterAlive = true));    //点击相同路由用来刷新页面
			},
        },
        mounted(){
            if(sessionStorage.getItem('pageMenuIndex') && sessionStorage.getItem('pageMenuIndex')>=0){
                this.menuData[sessionStorage.getItem('pageMenuIndex')].isSubShow = true;
            }
        }
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .center-box, .date-report{
        width:100%;
        height:100%;
        display: flex;
        flex-direction: row;
        background: #E7E8EB;
        .center-left {
            height: 100%;
            background: #fff;
            color: #333;
            flex-basis: 200px;
            position: relative;
            overflow: hidden;
            margin-right: 20px;
            > div {
                width: 200px;
            }
            /* /deep/ .navmenu-container{
                .navbar{
                    .actives { //选中菜单的样式
                        background: #1cab7d;
                        dd {
                            color: #fff;
                        }
                    }
                    .nav-div{
                        img.icon{
                            left:30px;
                        }
                        dd{
                            span{
                                font-size: 14px;
                            }
                        }
                        img.arrow{
                            // display: none;
                            border: 1px solid red;

                        }
                        img.arrow.imgActive{
                            -webkit-transform: rotate(180deg);
                            -moz-transform: rotate(180deg);
                            -ms-transform: rotate(180deg);
                            -o-transform: rotate(180deg);
                            transform: rotate(180deg);
                        }
                    }
                }
                .navbar:hover{
                    background: #1cab7d;
                    dd {
                        color: #fff;
                    }
                }
            } */
            /deep/ .navmenu-container{
                .navbar{
                    line-height: 5vh;
                    
                    .menuStyle{
                        background: #fff;
                        color: #333;
                        min-height: 5vh;
                        img.icon{
                            left:30px;
                        }
                        dd.dtdd{
                            height: 5vh;
                            line-height: 4.5vh;
                            span{
                                font-size: 14px;
                                vertical-align: inherit;
                            }
                        }
                        img.arrow{
                        }
                        img.arrow.imgActive{
                            -webkit-transform: rotate(180deg);
                            -moz-transform: rotate(180deg);
                            -ms-transform: rotate(180deg);
                            -o-transform: rotate(180deg);
                            transform: rotate(180deg);
                        }
                    }
                    .sub-menu{
                        background: #fff;
                        .scorll-div {
                            dd{
                                padding-left: 80px;
                                text-align: left;
                                font-size: 14px;
                                color: #4F4F4F;
                            }
                            &:hover{
                                dd{
                                    color: #1cab7d;
                                    background: #CDE7D8;
                                }
                            }
                            &.actives{
                                dd{
                                    color: #1cab7d;
                                    background: #CDE7D8;
                                }
                            }
                        }
                    }
                    .actives { //选中菜单的样式
                        background: #1cab7d;
                        dd {
                            color: #fff;
                        }
                    }
                }
                .navbar:hover{
                    .nav-div{
                        background: #1cab7d;
                    }
                    
                    dd {
                        color: #fff;
                    }
                }
            }
           .actives { //选中菜单的样式
                background: #1cab7d;
                dd {
                    color: #fff;
                }
            }
        }
        .center-right {
            flex: 5;
            height: 100%;
            overflow-x: scroll;
            overflow: hidden;

            .right-top {
                height: 40px;
                line-height: 40px;
                padding-left: 20px;

                span {
                    font-size: 12px;
                    font-weight: bold;
                    color: #676768;
                }
                span.navRoute {
                    font-weight: normal;
                    color: #676768;
                }
                span.navRoute2 {
                    font-weight: normal;
                    color: #0573DA;
                }
            }
            .right-center {
            }
        }
    }
</style>
