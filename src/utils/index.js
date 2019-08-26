import Vue from 'vue'
import axios from 'axios';
// import base from './base';
// 统一请求路径前缀
if (process.env.NODE_ENV == 'development') {
  // axios.defaults.baseURL = '/httpApi';//本地环境请求地址
  Vue.prototype.serverUrl = '/httpApi';  //用于导出 本地环境
  Vue.prototype.uploadPicUrl = 'http://res-mal.weds.com.cn/';  //本地环境域名前缀
} else if (process.env.NODE_ENV == 'mock') {
  axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') {
  // Vue.prototype.serverUrl = 'https://apigateway.weds.com.cn/web/v1/bepf/';  //打包部署上线时 阿里云url
  axios.defaults.baseURL = 'https://edu.weds.com.cn/web/v1/bepf/'; //生产环境请求地址
  Vue.prototype.serverUrl = 'https://edu.weds.com.cn/web/v1/bepf/';  //用于导出 生产环境
  Vue.prototype.uploadPicUrl = 'http://res-k12.weds.com.cn/';  //正式上传地址域名前缀
}
// localStorage.setItem('roleNos', JSON.stringify(['S01']));
// localStorage.setItem('roleNos',JSON.stringify(['SYS002']));

// localStorage.setItem('schoolId',101011);
// localStorage.setItem('userId',271);//1102
let dictionary = [{
  "sc_code_type": "CD1004",
  "sc_code_item": [{"code_item_id": "1", "cdoe_item_name": "爸爸"}]
}, {"sc_code_type": "CD1005", "sc_code_item": [{"code_item_id": "1", "cdoe_item_name": "爸爸"}]}];
localStorage.setItem('dictionary', JSON.stringify(dictionary));               //存储字典
Vue.prototype.dictionary = localStorage.getItem('dictionary') ? JSON.parse(localStorage.getItem('dictionary')) : [];// 字典
Vue.prototype.msgDuration = 2000;// $message提示时间
Vue.prototype.roleActions = [];// 全局获取权限
Vue.prototype.roleNos = localStorage.getItem('roleNos') ? JSON.parse(localStorage.getItem('roleNos')) : [];// 当前登陆者角色列表

//项目中用到的一些公共方法
export default {
  install(Vue) {
    //encrypt密码加密
    Vue.prototype.encrypt = function encryptPwd(word) {
      var keyStr = 'k;)*(+nmjdsf$#@d';
      var key = CryptoJS.enc.Utf8.parse(keyStr);
      var srcs = CryptoJS.enc.Utf8.parse(word);
      var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
      return encrypted.toString();
    };

    //验证input输入框
    Vue.prototype.checkInputChars = function (value, callback, selection, formOut, tipMsg) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
      if (regEn.test($.trim(value)) || regCn.test($.trim(value))) {
        if (formOut) {
          this.$message({
            showClose: true,
            message: tipMsg ? tipMsg : "不能包含特殊字符",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('不能包含特殊字符'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //验证textarea输入框
    Vue.prototype.checkTextareaChars = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      var regEn = /[`~!@#$%^&*()_+<>?:"{}\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、|《》？、【】[\]]/im;
      if (regEn.test($.trim(value)) || regCn.test($.trim(value))) {
        if (formOut) {
          this.$message({
            showClose: true,
            message: "不能包含特殊字符",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('不能包含特殊字符'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //手机号码的校验
    Vue.prototype.checkTel = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      var reg = /^1[3457689]\d{9}$/;
      if (!reg.test($.trim(value))) {
        if (formOut) {
          this.$message({
            showClose: true,
            message: "手机号格式不正确",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('手机号格式不正确'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //身份证号的校验
    Vue.prototype.checkCardNO = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      let aCity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
      };
      let iSum = 0;
      let info = "";
      if (!/(^\d{18}$)|(^\d{17}(\d|X|x)$)/i.test(value)) {        //身份证号长度验证
        if (formOut) {
          this.$message({
            showClose: true,
            message: "身份证长度或格式错误",
            type: "error",
            duration: 2000
          });
          return false
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('身份证长度或格式错误'));
            return false
          }
        }

        // console.log(66,aCity[11],aCity)

      } else {
        value = value.replace(/x$/i, "a");
        if (value.length === 18) {        //18位身份证号验证
          if (aCity[parseInt(value.substr(0, 2))] == null || aCity[parseInt(value.substr(0, 2))] == undefined) {        //身份证号所属省市验证
            if (formOut) {
              this.$message({
                showClose: true,
                message: "身份证地区非法",
                type: "error",
                duration: 2000
              });
              return false
            } else {
              if (selection) {
                callback();
              } else {
                callback(new Error('身份证地区非法'));
                return false
              }
            }
          }
          let sBirthday = value.substr(6, 4) + "-" + Number(value.substr(10, 2)) + "-" + Number(value.substr(12, 2));
          let d = new Date(sBirthday.replace(/-/g, "/"));
          if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
            if (formOut) {
              this.$message({
                showClose: true,
                message: "出生日期非法",
                type: "error",
                duration: 2000
              });
              return false
            } else {
              if (selection) {
                callback();
              } else {
                callback(new Error('出生日期非法'));
                return false
              }
            }
          }
          for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(value.charAt(17 - i), 11);
          if (iSum % 11 != 1) {
            if (formOut) {
              this.$message({
                showClose: true,
                message: "身份证号非法",
                type: "error",
                duration: 2000
              });
              return false
            } else {
              if (selection) {
                callback();
              } else {
                callback(new Error('身份证号非法'));
                return false
              }
            }
          }
          //	                aCity[parseInt(value.substr(0,2))]+","+sBirthday+","+(value.substr(16,1)%2?"男":"女");//此处还可以判断出输入的身份证号的人性别
          //	                console.log(8899,(value.substr(16,1)%2?"男":"女"))
        }
        return true
      }
    };

    //数字验证
    Vue.prototype.checkNumber = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      let reg = new RegExp("^[0-9]*$");
      if (!reg.test(value)) {
        if (formOut) {
          this.$message({
            showClose: true,
            message: "输入的非数字",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('输入的非数字'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //IP地址验证
    Vue.prototype.checkIP = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (!reg.test(value)) {
        if (formOut) {
          this.$message({
            showClose: true,
            message: "IP地址不合法",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('IP地址不合法'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //QQ号码验证
    Vue.prototype.checkQQ = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      let reg = /^[1-9][0-9]{4,9}$/
      if (!reg.test(value)) {
        if (formOut) {
          this.$message({
            showClose: true,
            message: "QQ号不合法",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('QQ号不合法'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //邮箱验证
    Vue.prototype.checkEmail = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
      if (!reg.test(value)) {
        if (formOut) {
          // console.log(11, this)
          this.$message({
            showClose: true,
            message: "邮箱格式不正确",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('邮箱格式不正确'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //用户名或账号验证(只能是数字、字母和下划线中的至少2种，并且不能数字开头)
    Vue.prototype.checkName = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z_][A-Za-z_0-9]{0,}$/
      if (!reg.test(value)) {
        if (formOut) {
          this.$message({
            showClose: true,
            message: "用户名或账号不合法",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('用户名或账号不合法'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //密码验证(密码长度在6~12位，只能是数字)
    Vue.prototype.checkPassword = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      let reg = /^[0-9]{6,12}$/;
      if (!reg.test(value)) {
        if (formOut) {
          this.$message({
            showClose: true,
            message: "密码格式不正确,请输入6-12位数字",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('密码格式不正确'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //密码验证(密码长度在6~12位，数字与字母的组合 可以为单数字也可以全是字母)
    Vue.prototype.checkPwdNumLetter = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      let reg = /^[0-9a-zA-Z]{6,16}$/;
      if (!reg.test(value)) {
        if (formOut) {
          this.$message({
            showClose: true,
            message: "密码格式不正确,请输入6-12位字母或数字",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('密码格式不正确'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //密码验证(密码长度在6~12位，只能是数字+字母)
    Vue.prototype.checkPwd = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
      if (!reg.test(value)) {
        if (formOut) {
          this.$message({
            showClose: true,
            message: "密码格式不正确,请输入6-12位字母和数字",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('密码格式不正确'));
          }
        }
        return false
      } else {
        return true
      }
    };

    //车牌号验证
    Vue.prototype.checkCarNO = function (value, callback, selection, formOut) {
      /**
       * value:验证内容;(必填)
       * callback:回调函数;(必填)
       * selection:form内选填;(选填)
       * formOut:$message提示方式;(选填)
       */
      let xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;//新能源车规则
      let creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;  //普通汽车规则
      if (value.length == 7) { 			//普通汽车规则校验
        if (!creg.test(value)) {
          if (formOut) {
            this.$message({
              showClose: true,
              message: "车牌号不合法",
              type: "error",
              duration: 2000
            });
          } else {
            if (selection) {
              callback();
            } else {
              callback(new Error('车牌号不合法'));
            }
          }
          return false
        } else {
          return true
        }
      } else if (value.length == 8) {	//新能源车规则校验
        if (!xreg.test(value)) {
          if (formOut) {
            this.$message({
              showClose: true,
              message: "车牌号不合法",
              type: "error",
              duration: 2000
            });
          } else {
            if (selection) {
              callback();
            } else {
              callback(new Error('车牌号不合法'));
            }
          }
          return false
        } else {
          return true
        }
      } else {
        if (formOut) {
          this.$message({
            showClose: true,
            message: "车牌号不合法",
            type: "error",
            duration: 2000
          });
        } else {
          if (selection) {
            callback();
          } else {
            callback(new Error('车牌号不合法'));
          }
        }
        return false
      }
    };

    //base64上传图片
    Vue.prototype.dataURItoBlob = function dataURItoBlob64(base64Data) {
      // console.log(111)
      let byteString;
      if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1])
      } else byteString = unescape(base64Data.split(',')[1])
      let mimeString = base64Data
        .split(',')[0]
        .split(':')[1]
        .split(';')[0]
      var ia = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ia], {type: mimeString})
    };

    //获取字典中需要的值
    Vue.prototype.getDictionary = function dictionary(value) {
      let data = Vue.prototype.dictionary;
      if (!Array.isArray(data)) return
      if (!value) return []
      let dictionaryArr = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].sc_code_type == value) {
          dictionaryArr = data[i].sc_code_item;
          break
        }
      }
      console.log("获取字典中需要的值:", dictionaryArr);
      return dictionaryArr;
    };

    //数字转星期几 页面展示
    Vue.prototype.numToWeek = function toWeek(value) {
      if (!value) return [];
      if (!Array.isArray(value)) return [];
      if (value.length != 7) return [];
      let weekData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      let week = value.map((item, index) => {
        if (item == 1) {
          return weekData[index]
        }
      })
      let weekArr = [];
      week.forEach((item, index) => {
        if (item) {
          weekArr.push(item)
        }
      })
      // console.log(weekArr);
      return weekArr;
    };

    //星期转数字 传参使用
    Vue.prototype.weekToNumParams = function toWeek(value) {
      if (!value) return [];
      if (!Array.isArray(value)) return [];
      let weekArr = [0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 7; i++) {

        for (let k = 0; k < value.length; k++) {
          if (i + 1 == value[k]) {
            weekArr[i] = 1;
          }
        }
      }
      // console.log(weekArr);
      return weekArr;
    };

    //数字转星期 前台需要的格式
    Vue.prototype.weekToNum = function toNum(value) {
      if (!value) return [];
      if (!Array.isArray(value)) return [];
      if (value.length != 7) return [];
      let week = value.map((item, index) => {
        if (item == 1) {
          return index + 1
        }
      })
      let weekArr = [];
      week.forEach(item => {
        if (item) {
          weekArr.push(item)
        }
      })
      // console.log(weekArr);
      return weekArr;
    };
  }
}
