<template>
  <div class="father">
    <div class="shadow">
      <div class="top"></div>
      <div class="login">
        <div class="login_main">
          <!-- <div class="main_left">
          <div class="left_title">
             <div style="vertical-align: middle;display: table-cell;">
                <font style="vertical-align: inherit;" class="fontss">商品追溯源平台</font>
                <div style="vertical-align: inherit;" class="fonts1">
                实现成品的物流追踪 物流流向数据可视化，为产品保驾护航。
                </div>
              </div>
               

          </div>
          </div>-->

          <div class="main_right">
            <div class="right_title">聊城百货大楼追溯平台登录</div>
            <el-form
              ref="loginForm"
              :model="loginForm"
              :rules="loginRules"
              class="login-form username"
            >
              <div class="username">
                <img src="../assets/img/username.png" alt />
                <el-input
                  v-model="loginForm.username"
                  id="username"
                  type="text"
                  auto-complete="off"
                  placeholder="账号"
                />
              </div>
              <div class="password">
                <img src="../assets/img/password.png" alt />
                <el-input
                  id="password"
                  v-model="loginForm.password"
                  type="password"
                  auto-complete="off"
                  placeholder="密码"
                  @keyup.enter.native="handleLogin"
                ></el-input>
              </div>

              <div class>
                <img src="../assets/img/password.png" alt />
                <el-input
                  v-model="loginForm.code"
                  auto-complete="off"
                  placeholder="验证码"
                  style="width:55%;"
                  @keyup.enter.native="handleLogin"
                  class="special"
                ></el-input>
                <img
                  :src="codeUrl"
                  @click="getCode"
                  style="width:100px;height:34px;position: absolute;top: 2px;left: 250px;"
                />
              </div>

              <div class="yes_login">
                <el-button
                  :loading="loading"
                  size="medium"
                  type="primary"
                  style="width:300px;margin-left:50px"
                  @click.native.prevent="handleLogin"
                >
                  <span v-if="!loading">
                    <img
                      src="../assets/image/login.png"
                      style=" width: 23px;height: 23px;margin-right: 5px;"
                    />
                    登 录
                  </span>
                  <span v-else>登 录 中...</span>
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
        <!--  底部  -->
        <div style="text-align:center">
          <img
                      src="../assets/img/code.png"
                      style=" width: 90px;height: 90px;margin-right: 5px;"
                    />
        </div>
        <div class="el-login-footer" style="text-align:center">
          <p class="p3">山东商业职业技术学院</p>
          <p class="p3">Copyright @ 聊城追溯 2020</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      loginRules: {},
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        console.log(route);
        //默认跳首页
        this.redirect = "/index";
        //跳转上次打开的界面
        //this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.codeUrl = "data:image/gif;base64," + res.img;
        this.loginForm.uuid = res.uuid;
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      if (this.loginForm.username == "") {
        this.msgError("账号不能为空!");
        return;
      }
      if (this.loginForm.password == "") {
        this.msgError("密码不能为空!");
        return;
      }
      if (this.loginForm.code == "") {
        this.msgError("验证码不能为空!");
        return;
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.loading = false;
              this.getCode();
            });
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
/*将标签原有的默认内外边距去掉*/

fieldset,
img,
input,
button {
  border: none; /*去掉边框*/
  padding: 0;
  margin: 0;
  outline-style: none; /*去掉环绕边框*/
}

ul,
ol {
  list-style: none; /*去掉原样式中的小黑点*/
  /*ctrl+alt+l*/
}

input {
  padding-top: 0;
  padding-bottom: 0;
}

select,
input {
  vertical-align: middle; /*输入字居中显示*/
}

select,
input,
textarea {
  font-size: 14px;
  margin: 0;
}

/**/
textarea {
  resize: none; /*防止拖动*/
}

img {
  border: 0;
  vertical-align: middle; /*  去掉图片底部默认的3像素空白缝隙*/
}

table {
  border-collapse: collapse; /*合并外边线*/
}

body {
  font-family: Microsoft YaHei, Arial, "\5b8b\4f53";
  /*background: #0058ac;*/
}

.clearfix:before,
.clearfix:after {
  content: "";
  display: table;
}

.clearfix:after {
  clear: both;
}

.clearfix {
  *zoom: 1; /*IE/7/6*/
  /*兼容IE6下的写法*/
}

h1,
h2,
h3,
h4,
h5,
h6 {
  text-decoration: none; /**/
  font-weight: normal; /*不加粗*/
  font-size: 100%;
}
.top,
.bottom {
  width: 100%;
  height: 50%;
  float: left;
}
.top {
  width: 100%;
  // height: 500px;
  background: url("../assets/img/bg1.jpg") no-repeat;
  background-size: cover;
  background-position: center;
}
.bottom {
  /*background: url(../img/back.jpg) no-repeat center fixed;*/
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  -ms-background-size: cover;
}
/*login 开始*/
.login {
  width: 400px;
  /*    height: 500px;*/
  /*background-color: yellowgreen;*/
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -150px;
}
.login > .login_title {
  height: 80px;
  text-align: center;
}
.login > .login_title > p {
  color: #daa411;
  font-size: 40px;
  font-weight: 600;
  margin-top: -8px;
  letter-spacing: 5px;
  font-family: "Times New Roman", Times, serif;
}
.login > .login_main {
  width: 400px;
  height: 320px;
}
.login > .login_main > .main_left {
  height: 320px;
  width: 650px;
  float: left;
  -moz-border-top-left-radius: 10px;
  -webkit-border-top-left-radius: 10px;
  border-top-left-radius: 10px;
  -moz-border-bottom-left-radius: 10px;
  -webkit-border-bottom-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background-size: cover;
  background: url("../assets/img/bg5.png") no-repeat;
  padding: 20px;
  box-sizing: border-box;
  background-position: center;
}
.login > .login_main > .main_right {
  height: 310px;
  width: 400px;
  float: right;
  background-color: #fff;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22);
}
.yes_login {
  margin-top: 5px;
}
.login > .login_main > .main_right > .right_title {
  color: #3277fc;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  line-height: 60px;
  background: url("../assets/img/border_img.png") repeat;
  margin-bottom: 30px;
}
.login > .login_main > .main_right > form > div {
  position: relative;
}
.login > .login_main > .main_right > form > div > img {
  position: absolute;
  left: 62px;
  top: 10px;
  width: 20px;
  height: 20px;
  z-index: 999;
}
.login > .login_main > .main_right > form input {
  height: 38px;
  width: 300px;
  line-height: 38px;
  border: 1px solid #d3d8dc;
  box-sizing: border-box;
  margin-bottom: 10px;
  margin-left: 50px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  color: #333;
  padding-left: 40px;
  background-color: #eceef0;
}

.login > .login_main > .main_right > form > .code > input {
  width: 200px;
}
.login > .login_main > .main_right > form > .code > .code_img {
  width: 90px;
  height: 35px;
  float: right;
  margin-right: 50px;
  cursor: pointer;
}
.login > .login_main > .main_right > form input:focus {
  /*border: 1px solid #999;*/
  /*   border-color: #343642;*/
  box-shadow: 0 0 5px rgba(52, 54, 66, 0.1);
  outline: none;
}
.login > .login_main > .main_right > form > .yes_login > a {
  display: block;
  width: 300px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  background-color: #3277fc;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  border-radius: 3px;
  color: #fff;
  text-decoration: none;
  margin-left: 50px;
}
.login > .login_main > .main_right > form > .yes_login > a:hover {
  /*background-color: #0058af;*/
  cursor: pointer;
}
.login > .login_footer {
  text-align: center;
  padding-top: 20px;
}
.login > .login_footer > p {
  font-size: 14px;
  color: #eee;
  line-height: 30px;
}
.left_title {
  /*background-color: red;*/
  height: 100%;
  border: 1px solid #fff;
  box-sizing: border-box;
  padding: 20px 20px;
  display: table;
  width: 100%;
}
.fontss {
  color: #fff;
  font-size: 24px;
  text-align: center;
  display: block;
  padding: 5px 0px;
}
.fonts1 {
  color: #fff;
  font-size: 20px;
  padding: 5px 0px;
}
.father,.shadow {
  height:100%
}
/*login 结束*/

/*login 结束*/
</style>
