<template>
    <div class="education-set">
        <div class="education-top">
            <NavMenu :data="menuData" blocks="inline" dtPLeft="padding-left: 8px; font-size:15px;" :clickActive1="clickActive"
                     menuStyle="menuStyle" @click="clickMenu" actives="actives" :defArrow="defArrow"></NavMenu>
        </div>
        <div class="set-bottom">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import NavMenu from '@/components/NavMenu/NavMenu'

	export default {
		name: 'ClassSelectionNavSet',
		components: {
			Button,NavMenu
		},
		data() {
			return {
				defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
				menuData:[          //右侧导航数组
					{
						title: '走班课程管理',
						value: 1,
						icon: require('../../../assets/images/course_no.png'),
						iconActive: require('../../../assets/images/course_ac.png')
					},
					{
						title: '走班学生管理',
						value: 2,
						icon: require('../../../assets/images/student_no.png'),
						iconActive: require('../../../assets/images/student_ac.png')
					},
					{
						title: '走班排课（学年）',
						value: 3,
						icon: require('../../../assets/images/scheduling_no.png'),
						iconActive: require('../../../assets/images/scheduling_ac.png')
					},
					{
						title: '走班排课（学期）',
						value: 4,
						icon: require('../../../assets/images/scheduling_no.png'),
						iconActive: require('../../../assets/images/scheduling_ac.png')
					},
				],
				clickActive: sessionStorage.getItem('threeMenuIndex')?sessionStorage.getItem('threeMenuIndex'): 0,
			}
		},
		methods: {
			/**
			 *  @function: 楼宇添加按钮
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			clickMenu(index, item) {
				console.log('clickMenu', index, item)
				if (item.value == 1) {//
					this.$router.push('/SelectCourseManage')		//走班课程管理
				} else if (item.value == 2) {
					this.$router.push('/SelectStudentManage')		//教师任课
				}else if (item.value == 3) {
					this.$router.push('/SelectCourseYear')			//排课（学年）
				}else if (item.value == 4) {
					this.$router.push('/SelectCourseTerm')			//排课（学期）
				}
				sessionStorage.setItem('threeMenuIndex',index);
			},
		},
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .education-set {
        width: 100%;
        height: 100%;
        margin: 0 auto;
		background-color: #E7E8EB;
        .education-top{
            height:6vh;
            background:#F5F7F8;
            /deep/ .navmenu-container{
                .navbar{
                    .nav-div{
                        text-align: center;
                        color:#c0c4cc;
                        &.actives {
                            color: #1cab7d;
                        }
                    }
                    .icon{
                        position: static;
                    }
					.arrow{
						height: 23px;
					}
                    &:last-child{
                        .arrow{
                            display: none;
                        }
                    }
                }
            }
        }
        .set-bottom{
            margin-top: 10px;
        }
    }
</style>
