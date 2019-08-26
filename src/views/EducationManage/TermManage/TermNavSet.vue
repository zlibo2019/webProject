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
		name: 'HelloWorld',
		components: {
			Button,NavMenu
		},
		data() {
			return {
				defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
				menuData:[          //右侧导航数组
					{
						title: '学年/学期管理',
						value: 1,
						icon: require('../../../assets/images/term_no.png'),
						iconActive: require('../../../assets/images/term_ac.png')
					},
					{
						title: '校历管理',
						value: 2,
						icon: require('../../../assets/images/calendar_no.png'),
						iconActive: require('../../../assets/images/calendar_ac.png')
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
					this.$router.push('/TermManage')		//学年/学期管理
				} else if (item.value == 2) {
					this.$router.push('/SchoolCalendar')	//校历管理
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
            height:58px !important;
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
            background-color: #fff;
        }
    }
</style>
