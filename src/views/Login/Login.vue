<template>
    <form class="login">
        <div class="m-top">威尔协同教育校云平台bbbbbbbbbbbb</div>
        <div class="m-cen">
            <div class="login-div">
                <div class="title">账号登录</div>
                <ul class="signIn">
                    <li class="account">
                        <span class="name-span">用户名</span><span>：</span>
                        <input type="text" placeholder="手机号或管理员账号" v-model="account" 
                                @keypress="keypress" maxlength="11"/>
                    </li>
                    <li class="password">
                        <span class="name-span">密码</span><span>：</span>
                        <input type="password" placeholder="输入密码" v-model="userPwd"
                               @keypress="keypress"/>
                    </li>
                </ul>
                <Button title="登录" btnClass="custom8" btnFontSize="14px" btnHeight="5.5vh" @click="loginClick"></Button>
            </div>
        </div>
        <div class="m-bom">
            <div class="b-left">山东威尔数据股份有限公司</div>
            <div class="b-right">0535-3971818</div>
        </div>
        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </form>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'
    import {Loading} from 'element-ui';
	export default {
		name: 'login',
		components: {
			Button,Toast
		},
		data() {
			return {
				account: localStorage.getItem('account') ? localStorage.getItem('account') : '',//13188884545
				userPwd: localStorage.getItem('userPwd') ? localStorage.getItem('userPwd') : '123456',
				accActive: false, //账号输入状态
				psdActive: false, //密码输入状态
				isToast:false,
				toast:'',
			}
		},
		methods: {
			/**
			 * 登录接口
			 * wzx
			 * 2018.7.18
			 */
			loginClick() {//登录
                // console.log('点击登录按钮')
                this.accBlur(this.account)
                if(!this.accActive) return
                this.psdBlur(this.userPwd)
                if(!this.psdActive) return
				Loading.service();
                let params = {
                    loginName:this.account,
                    client: 'web',//2018-09-15 新增区分客户端
	                pwd:this.encrypt(this.userPwd),
                    type:"2"
                }
                this.$api.Login.login(params).then(res => {
                    // console.log("res:",res)
                    Loading.service().close();
                    res.data.code = 600;
					if(res.data.code == 600){
					 	localStorage.setItem('account',this.account);                    //登录账号
					 	localStorage.setItem('userPwd',this.userPwd);                    //登录密码
					 	localStorage.setItem('placeTopId',res.data.data.placeTopId);         //学校根节点id--新增楼宇时使用
					 	localStorage.setItem('schoolId',res.data.data.userInfo.schoolId);         //学校ID
						localStorage.setItem('schoolName',res.data.data.userInfo.schoolName);         //学校Name
					 	localStorage.setItem('userName',res.data.data.userInfo.userName);        //用户名
					 	localStorage.setItem('userNo',res.data.data.userInfo.userNo);             //用户学号/工号
					 	localStorage.setItem('userId',res.data.data.userInfo.userId);;             //userId
					 	localStorage.setItem('phoneNo',res.data.data.userInfo.phoneNo);             //phoneNo
						localStorage.setItem('classFormat',res.data.data.schoolInfo.classFormat);    //班级显示格式 //1: 一班 ，2: 1班 ，3:（1）班 
					 	localStorage.setItem('token',res.data.data.token);             //存储token信息
                        localStorage.setItem('roleActions',JSON.stringify(res.data.data.roleActions));     //存储菜单权限
                        this.$store.commit({
                            type: 'SET_ROLEACTION_LIST',
                            roleActions: JSON.parse(localStorage.getItem('roleActions'))
                        })
						localStorage.setItem('roleNos',JSON.stringify(res.data.data.roleNos));             //存储菜单权限角色id
						localStorage.setItem('isExistsSysPwd',res.data.data.isExistsSysPwd);               //生成密码 0--未生成 1--已生成
                        // let dictionary = [{"sc_code_type":"CD1004","sc_code_item":[{"code_item_id":"1","cdoe_item_name":"爸爸"}]},{"sc_code_type":"CD1005","sc_code_item":[{"code_item_id":"1","cdoe_item_name":"爸爸"}]}];
                        // localStorage.setItem('dictionary',JSON.stringify(dictionary));               //存储字典
                        // console.log(666,localStorage.getItem('userId'));
						this.$router.push('/Index');
                        // let schoolId = {
                        //     school_id:res.data.data.userInfo.schoolId,
                        // }
                        // this.$api.Login.getDictionary(schoolId).then(response => {
                        //     console.log('getDictionary:',response);
                        // })
                        // getDictionary
					}else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
                }).catch(err =>{
                    console.log('出错了！！！！');
                    Loading.service().close();
                })
			},
			/**
			 * 回车登录
			 * wzx
			 * 2018.7.18
			 */
			keypress() {
				if (event.keyCode == 13) {
					if (this.account != '' && this.userPwd != '') {
						this.loginClick()
					}
					if (this.account == '') {
						$('input')[0].focus()
					}
					if (this.userPwd == '') {
						$('input')[1].focus()
					}
				}
			},
			/**
			 * 输入账号失去焦点
			 * wzx
			 * 2018.9.7
			 */
			accBlur(value) {
				// console.log("失去焦点");
				if(value){
					this.accActive = this.formOutTest(value, 'checkTel');
				}else{
					this.$message({
						showClose: true,
						message: "用户名不能为空",
						type: "error",
						duration: 1000
					});
				}
			},
			/**
			 * 输入密码失去焦点
			 * wzx
			 * 2018.9.7
			 */
			psdBlur(value) {
				// console.log("失去焦点");
				if(value){
					this.psdActive = this.formOutTest(value, 'checkPwdNumLetter')
				}else{
					this.$message({
						showClose: true,
						message: "密码不能为空",
						type: "error",
						duration: 1000
					});
				}
			},
			/**
			 * toast弹窗隐藏
			 * wzx
			 * 2018.7.18
			 */
			hideToast() {
				this.isToast = false;
			},

			/**
			 *  @function: 输入内容校验----form外
			 *  @author: cs
			 *  @date 2018-09-06
			 */
			formOutTest(value,funcName) {
				/**
				 * value:要验证的内容
				 * funcName:验证的方法名
				 */
				// console.log("value:",value,funcName)
				//验证内容
				let state = false;
				if (value) {
					state = this[funcName](value, '',1,1);
				} else {
					state = false;
				}
				return state;
			},
		},
		mounted() {
			$('input')[0].focus();
			$('.m-cen').height($('.login').height() - $('.m-top').height() - $('.m-bom').height());
			sessionStorage.removeItem('menuIndex');     // 清除一级导航
			sessionStorage.removeItem('menuIndexSub'); // 清除二级导航数据
            sessionStorage.removeItem('submenuIndex'); // 清除二级导航
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .login {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        .m-top {
            width: 100%;
            height: 6.7vh;
            line-height: 6.3vh;
            padding-left: 8%;
            font-size: 16px;
            background: #FDFDFD;
            border-bottom: 1px solid #E7E8EB;
        }
        .m-cen{
            background: #F7F7F9;
            display: flex;
            align-items: center;
            justify-content: center;
            .login-div{
                background: #fff;
                padding: 5%;
                padding-top: 3%;
                border-radius: 2%;
                text-align: center;
                .title {
                    font-size: 16px;
                    text-align: center;
                }
                .signIn {
                    padding-top: 5vh;
                    margin-bottom: 4.3vh;
                    .act {
                        /*border: 1px solid #1cab7d;*/
                    }
                    li {
                        position: relative;
                        height: 45px;
                        height: 5vh;
                        margin: 0 auto;
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        > span,img,input,> div{
                            vertical-align: middle;
                            display: inline-block;
                            float: left;
                        }
                        > span {
                            line-height: 5vh;
                            margin-right: 20px;
                            text-align: right;
                            font-size: 12px;
                        }
                        span.name-span{
                            width: 50px;
                            margin-right: 0;
                            text-align:justify;
                            text-justify:distribute-all-lines;/*ie6-8*/
                            text-align-last:justify;/* ie9*/
                            -moz-text-align-last:justify;/*ff*/
                            -webkit-text-align-last:justify;/*chrome 20+*/
                        }
                        input {
                            width: 100%;
                            width: 250px;
                            height: 100%;
                            padding: 0 1vh;
                            display: block;
                            background-color: transparent;
                            outline: none;
                            border: 1px solid #EEEEEE;
                            color: #333;
                            font-size: 12px;
                        }
                        .button-div{
                            margin-left: 1vw;
                            .button{
                                padding: 0 2vh;
                                background: #FAFAFA;
                                color: #2A6EB5;
                                border: 1px solid #E8E8E8;
                            }
                        }
                    }
                    .account {
                        img {
                            left: 12px;
                            top: 0;
                            bottom: 0;
                            margin: auto;
                            width: 20px;
                        }
                    }
                    .password {
                        margin-bottom: 0;
                        position: relative;
                        .left {
                            left: 12px;
                            top: 0;
                            bottom: 0;
                            margin: auto;
                            width: 20px;
                        }
                        form{
                            height: 5vh;
                        }
                        #upfile{
                            position: absolute;
                            display: none;
                        }
                    }
                }
                > .button-div {
                    width: 330px;
                }
            }
        }
        .m-bom {
            width: 100%;
            height: 8vh;
            line-height: 8vh;
            background: #E7E8EB;
            display: flex;
            font-size: 12px;
            .b-left{
                flex: 1;
                text-align: left;
                padding-left: 5%;
            }
            .b-right{
                flex: 1;
                text-align: right;
                padding-right: 2%;
            }
        }
    }
</style>
