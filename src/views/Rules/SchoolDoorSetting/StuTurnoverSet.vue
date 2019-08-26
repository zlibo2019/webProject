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
	                    title: '楼宇/设备',
	                    value: 1,
	                    isSubShow: false,
	                    icon: require('../../../assets/images/stuRulesd_01.png'),
	                    iconActive: require('../../../assets/images/stuRuless_01.png')
                    },
                    {
	                    title: '进出时段规则',
	                    value: 2,
	                    isSubShow: false,
	                    icon: require('../../../assets/images/stuRulesd_02.png'),
	                    iconActive: require('../../../assets/images/stuRuless_02.png')
                    },
                    {
	                    title: '学生进出权限',
	                    value: 3,
	                    isSubShow: false,
	                    icon: require('../../../assets/images/stuRulesd_03.png'),
	                    iconActive: require('../../../assets/images/stuRuless_03.png')
                    },
                ],
				clickActive: sessionStorage.getItem('childMenuIndex')?sessionStorage.getItem('childMenuIndex'): 0,
			}
		},
		methods: {
			clickMenu(index, item) {
				// console.log('clickMenu', index, item)
				if (item.value == 1) {//
					this.$router.push('/BuildingsDevices')      //楼宇/设备
				} else if (item.value == 2) {
					this.$router.push('/StuRuleTime')            //时段规则
				}else if (item.value == 3) {
					this.$router.push('/StudentAccess')          //进出权限
				}
				sessionStorage.setItem('childMenuIndex',index);
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
            line-height: 58px;
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
      /*  .m-top{
            width:100%;
            height:auto;
            background:#fff;
            margin-bottom: 15px;
            .title{
            }
            .content{
                max-height: 7vh;
                !*max-height: 11.5vh;*!
                padding: 15px 2% 0;
                position: relative;
                overflow: auto;
                .groupBtn{
                    position: relative;
                    float: left;
                    display: inline-block;
                    margin-right: 10px;
                    margin-bottom: 15px;
                    z-index: 1;
                    .el-button{
                        &:hover{
                            color: #1b9a71;
                            border: 1px solid #1b9a71;
                        }
                        &:active{
                            color: #1b9a71;
                            border: 1px solid #1b9a71;
                        }
                    }
                    img{
                        width: 15px;
                        height: 15px;
                        position: absolute;
                        right: -7px;
                        top: -7px;
                    }
                }
                .shade-div{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
                /deep/ .el-input{
                    &.act {
                        input{
                            background: #1cab7d;
                            color: #fff;
                        }
                    }
                    &.edit{
                        input{
                            background: transparent;
                            color: #333;
                        }
                    }
                }
            }
        }
        .m-cen{
            width:100%;
            height:auto;
            background:#fff;
            margin-bottom: 15px;
            .title{
                border: 0;
            }
            > .content{
                height: 25vh;
                /deep/ .el-table thead th{
                    background: #fff;
                    color: #636363;
                }
            }
            .sch-system-dialog{
                .el-form-item{
                    width:100%;
                    text-align: left;
                    position: relative;
                    padding-left: 2%;
                    padding-right: 3%;
                    margin-bottom: 0!important;
                    /deep/ .el-radio-group{
                        .el-radio{
                            display: inline-block;
                        }
                    }
                    .el-table{
                        width:800px;
                    }
                }
                /deep/ .el-radio-group{
                    line-height: 40px;
                    position: relative;
                    .el-radio{
                        display: inline-block;
                    }
                }
                /deep/ .el-dialog__footer{
                    .dialog-footer{
                        margin:0 auto;
                        text-align: center;
                        .button-div{
                            clear: both;
                            float:none;
                            margin-right: 20px;
                        }
                    }
                }
            }
        }
        .m-bom{
            .title{
            }
            .table-box{
                /deep/ .el-table thead th{
                    background: #fff;
                }
                .roll-span{
                    border-bottom: 1px solid #1cab7d;
                    color: #1cab7d;
                }
                /deep/ table td:last-child .cell{
                    text-align: center;
                }
                .operate1-div{
                    display: inline-block;
                    border: 1px solid #1cab7d;
                    color: #1cab7d;
                    padding: 2px 10px;
                    border-radius: 4px;
                    margin-right: 10px;
                }
                .operate2-div{
                    display: inline-block;
                    border: 1px solid #FF4E4E;
                    color: #FF4E4E;
                    padding: 2px 10px;
                    border-radius: 4px;
                }
            }
        }
        .title{
            height: 5.5vh;
            line-height: 5.5vh;
            background: #F6F8FA;
            border-bottom: 1px solid #E4E4E4;
            padding:0 0 0 3%;
            font-weight: bold;
            font-size: 18px;
            .btns1, .btns2{
                display: inline-block;
                float: right;
                margin-right: 10px;
            }
            .button-div{
                /deep/ .button{
                    background: transparent;
                    border-color: transparent;
                    color: #333;
                    img{
                        width: 20px;
                        height: 20px;
                    }
                    &:hover{
                        background: #f9fffc;
                        border: 1px solid #1cab7d;
                    }
                    &:active{
                        background: transparent;
                    }
                }
            }
        }*/
    }
</style>
