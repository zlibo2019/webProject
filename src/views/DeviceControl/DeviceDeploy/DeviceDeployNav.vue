<template>
    <div class="center-box date-report">
        <div class="center-left" ref="abc">
            <NavMenu :data="menuData" blocks="block" dtPLeft="padding-left: 70px; font-size:14px;"
                     menuStyle="menuStyle" @click="clickMenu" actives="actives" :expand="true" :clickActive1="clickActive"></NavMenu>
        </div>
        <div class="center-right">
            <div class="right-center">
                <router-view></router-view>
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
				menuData: [
					// {
					// 	title: '校门进出',
					// 	value: 1,
					// 	isSubShow: true,
					// 	icon: require('../../../assets/images/report_d01.png'),
					// 	iconActive: require('../../../assets/images/report_s01.png')
					// },
					// {
					// 	title: '访客进出',
					// 	value: 2,
					// 	isSubShow: true,
					// 	icon: require('../../../assets/images/report_d05.png'),
					// 	iconActive: require('../../../assets/images/report_s05.png')
					// },
					{
						title: '智慧班牌',
						value: 3,
						isSubShow: true,
						icon: require('../../../assets/images/report_d02.png'),
						iconActive: require('../../../assets/images/report_s02.png')
					},
					{
						title: '视频监控',
						value: 4,
						isSubShow: true,
						icon: require('../../../assets/images/report_d02.png'),
						iconActive: require('../../../assets/images/report_s02.png')
					}
				],
				isToast: false,
				toast: '',
				clickActive: sessionStorage.getItem('pageMenuIndex')?sessionStorage.getItem('pageMenuIndex'): 0,
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
				// console.log('clickMenu', index, item)
				if (item.value == 1) {//
					this.$router.push('/AddDevice')       // 校门进出
				} else if (item.value == 2) {
					this.$router.push('/AddDevice')       // 访客进出
				} else if (item.value == 3) {
					this.$router.push('/AddDevice')       // 智慧班牌
				} else if (item.value == 4) {
					this.$router.push('/VideoMonitoring') // 视频监控
				} 
				sessionStorage.setItem('pageMenuIndex',index);
			},
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
            /deep/ .navmenu-container{
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
                            display: none;
                        }
                    }
                }
                .navbar:hover{
                    background: #1cab7d;
                    dd {
                        color: #fff;
                    }
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
                height:100%;
            }
        }
    }
</style>
