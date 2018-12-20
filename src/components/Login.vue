<template>
  <div id="app">
    <div class="login">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <div class="img"></div>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// 导入axios
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset() {
      this.$refs.form.resetFields()
    },
    login() {
      // console.log(this.$refs.form.validate)
      this.$refs.form.validate(valid => {
        // console.log(valid)
        if (valid) {
          // 校验成功，发送axios请求数据
          axios({
            method: 'post',
            url: 'http://localhost:8888/api/private/v1/login',
            data: this.form
          }).then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              // 请求数据成功
              // 提示信息
              this.$message({
                message: '登录成功啦',
                type: 'success',
                duration: 2000
              })
              // 在本地存储token
              localStorage.setItem('token', res.data.data.token)
              // 跳转到home组件
              this.$router.push('/home')
            } else {
              this.$message({
                message: '登录失败',
                type: 'error',
                duration: 2000
              })
            }
          })
        } else {
          // 校验失败
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  height: 100%;
  width: 100%;
  background-color: #2d434c;
  overflow: hidden;

  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px;
    border-radius: 20px;
    position: relative;

    .img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: url('../assets/lyf.jpg') no-repeat;
      background-size: 110% 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -50px;
    }
  }
}
</style>
