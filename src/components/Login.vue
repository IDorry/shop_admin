<template>
  <div id="app">
    <div class="login">
      <el-form ref="form" :model="form" label-width="80px">
        <div class="img"></div>
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style lang="less">
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
