<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        <span>欢迎你呀</span>
        <a href="javascript:;" @click="logout">退出</a>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
      router
      unique-opened
      :default-active="$route.path.slice(1)"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu :index="menu.path" v-for="menu in menuList" :key="menu.id">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{menu.authName}}</span>
        </template>
        <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
          <i class="el-icon-menu"></i>
          <span slot="title">{{item.authName}}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
      <el-main>
        <!-- 这里是home路由的子组件 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    // 退出功能
    async logout() {
      try {
        await this.$confirm('确定要退出吗？', '提示', {
          confiremButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 提示消息
        this.$message({
          type: 'success',
          message: '已退出'
        })
        // 删除token
        localStorage.removeItem('token')
        // 路由到登录组件
        this.$router.push('/login')
      } catch (e) {
        this.$message.info('取消退出')
      }
    },
    async getMenuList() {
      let res = await this.axios.get('menus')
      if (res.meta.status === 200) {
        this.menuList = res.data
      }
    }
  },
  created() {
    this.getMenuList()
    // 整个路由对象---跳转路由
    // console.log(this.$router)
    // 当前路由的信息----当前路由的参数
    // console.log(this.$route)
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100%;

  .el-header {
    height: 60px;
    background-color: #b3c1cd;
    display: flex;
    .logo {
      width: 180px;
      background: url('~@/assets/logo.png') no-repeat;
      background-size: contain;
      background-position: center;
    }
    .title {
      flex: 1;
      text-align: center;
      line-height: 60px;
      color: #fff;
      font-size: 22px;
    }
    .logout {
      width: 180px;
      line-height: 60px;
      text-align: right;
      span {
        font-weight: 700;
      }
      a {
        color: chocolate;
        font-weight: 700;
      }
    }
  }
  .el-aside {
    width: 200px;
    background-color: #545c64;

    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #eee;
  }
}
</style>
