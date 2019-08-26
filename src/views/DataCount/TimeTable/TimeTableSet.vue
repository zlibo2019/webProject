<template>
    <div class="stu-turnover-set">
        <div class="set-top">
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
		name: 'HelloWorld',
		components: {
			Button,NavMenu
		},
		data() {
			return {
                defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
				menuData:[          //右侧导航数组
                    {
	                    title: '课表监控',
	                    value: 1,
	                    isSubShow: false,
	                    // icon: require('../../../assets/images/card_template_no.png'),
	                    // iconActive: require('../../../assets/images/card_template_ac.png')
                    },
                    {
	                    title: '班级/教室课表',
	                    value: 2,
	                    isSubShow: false,
	                    // icon: require('../../../assets/images/card_platform_no.png'),
	                    // iconActive: require('../../../assets/images/card_platform_ac.png')
                    },
                    {
	                    title: '教师课表',
	                    value: 3,
	                    isSubShow: false,
	                    // icon: require('../../../assets/images/card_rule_no.png'),
	                    // iconActive: require('../../../assets/images/card_rule_ac.png')
                    },
                    {
	                    title: '学生课表',
	                    value: 4,
	                    isSubShow: false,
	                    // icon: require('../../../assets/images/card_rule_no.png'),
	                    // iconActive: require('../../../assets/images/card_rule_ac.png')
                    },
                ],
				clickActive: sessionStorage.getItem('childMenuIndex')?sessionStorage.getItem('childMenuIndex'): 0,
			}
		},
		methods: {
			clickMenu(index, item) {
				console.log('clickMenu', index, item)
				if (item.value == 1) {
					this.$router.push('/ScheduleMonitor')          //课表监控
				} else if (item.value == 2) {
					this.$router.push('/PlaceTimeTable')            //班级/教室课表
				}else if (item.value == 3) {
					this.$router.push('/TeacherTimeTable')          //教师课表
				}else if (item.value == 4) {
					this.$router.push('/ClassTimeTable')          //学生课表
                }
				sessionStorage.setItem('childMenuIndex',index);
                // sessionStorage.setItem('threeMenuIndex',0);
			}
		},
		mounted() {
			setTimeout(()=> {
				let icH = $('.index > .m-cen').height();
				let ttH = $('.stu-turnover-set > .m-top').height();
				let obH = $('.operate-box').height();
				let pbH = $('.pagination-box').height();
				// let tblH = icH - ttH - obH - pbH -15;
				// console.log(666,icH,ttH,obH,pbH,tblH)
				// $('.table-box').height(tblH)
                let tblH = icH - $('.stu-turnover-set .title').height() - $('.stu-turnover-set > .m-top').height()
                    - $('.stu-turnover-set > .m-cen').height() - 30;
                $('.stu-turnover-set .m-bom .table-box').height(tblH)
			},25)
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .stu-turnover-set {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        .set-top{
            height:58px;
            background:#F5F7F8;
            margin-bottom: 10px;
            /deep/ .navmenu-container{
                .navbar{
                    .nav-div{
                        text-align: center;
                        color:#c0c4cc;
                        &.actives {
                            color: #1cab7d;
                        }
                        dd{
                            vertical-align: top;
                        }
                    }
                    .icon{
                        position: static;
                    }
                    .arrow{
						height: 23px;
                        right: 0;
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
            // margin-top: 10px;
        }
    }
</style>
