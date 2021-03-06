<template>
  <div class="users">
    <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      </el-breadcrumb>
    <!-- 搜索框 -->
      <el-input v-model="query" placeholder="请输入内容" @keyup.enter.native="search">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    <el-button type="success" plain @click="showAddDialog">添加用户</el-button>
    <!-- 用户列表 -->
      <el-table
        :data="userList"
        style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="mg_state" label="用户状态">
          <!-- 在自定义列模板里，使用作用域插槽 -->
          <template slot-scope="scope">
            <el-switch @change="changeState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="showEditDialog(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delUser(scope.row.id)"></el-button>
            <el-button type="success" icon="el-icon-check" plain size="mini" @click="showAssignDialog(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    ></el-pagination>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%">
      <!-- 添加表单 -->
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" placeholder="请输入用户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入用户手机"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改表单的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="rules" status-icon>
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入用户邮箱"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入用户手机"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配用户 -->
    <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="40%">
      <el-form ref="assignForm" :model="assignForm" label-width="80px" status-icon>
        <el-form-item label="用户名">
          <el-tag type="info">{{assignForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      query: '',
      currentPage: 1,
      pageSize: 2,
      total: 0,
      // 控制添加用户的对话框的显示与隐藏
      addDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 校验表单
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 9, message: '用户名长度在3-9位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度在6-12位', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入一个合法的邮箱', trigger: 'blur' }
        ],
        mobile: [
          {
            pattern: /^1\d{10}$/,
            massage: '请输入一个合法的手机号',
            trigger: 'blur'
          }
        ]
      },
      // 编辑用户
      editDialogVisible: false,
      editForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      assignDialogVisible: false,
      assignForm: {
        id: '',
        username: '',
        rid: ''
      },
      roleList: []
    }
  },
  methods: {
    async getUserList() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        // 请求方式是get，参数用params
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      // console.log(res.data)
      // 判断是否成功请求到数据，成功就渲染
      let { meta: { status }, data: { users, total } } = res
      if (status === 200) {
        this.userList = users
        this.total = total
      }
    },
    async delUser(id) {
      try {
        await this.$confirm('确定要删除这条数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 发送ajax请求，删除数据
        let res = await this.axios({
          method: 'delete',
          url: `users/${id}`
        })
        if (res.meta.status === 200) {
          // 如果我们发现当前页只有一条数据了，应该current减1，渲染上一页
          if (this.userList.length <= 1 && this.currentPage > 1) {
            this.currentPage--
          }
          // 渲染
          this.getUserList()
          this.$message.success('删除成功！')
        }
      } catch (e) {
        this.$message.info('删除成功')
      }
    },
    search() {
      // 搜索的时候，把当前页第一页
      this.currentPage = 1
      this.getUserList()
    },
    handleSizeChange(val) {
      // 修改this.pageSize
      this.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      // 把currentPage改成val
      this.currentPage = val
      this.getUserList()
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    addUser() {
      // 1. 表单校验功能
      // 2. 发送ajax请求添加数据
      // 3. 重新渲染  关闭模态框  重置样式
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 校验成功
        let res = await this.axios({
          method: 'post',
          url: 'users',
          data: this.addForm
        })
        // console.log(res)
        let { meta: { status, msg } } = res
        if (status === 201) {
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          this.getUserList()
          this.$refs.addForm.resetFields()
          this.addDialogVisible = false
          this.$message.success('添加成功')
        } else {
          this.$message.error(msg)
        }
      })
    },
    showEditDialog(row) {
      this.editDialogVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    updateUser() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          method: 'put',
          url: `users/${this.editForm.id}`,
          data: this.editForm
        })
        let { meta: { status } } = res
        if (status === 200) {
          this.getUserList()
          this.editDialogVisible = false
          this.$refs.editForm.resetFields()
          this.$message.success('修改成功')
        } else {
          this.$message.error('服务器异常')
        }
      })
    },
    async changeState({ id, mg_state: mgState }) {
      let res = await this.axios({
        method: 'put',
        url: `users/${id}/state/${mgState}`
      })
      if (res.meta.status === 200) {
        this.$message.success('状态修改成功')
      } else {
        this.$message.error('状态修改失败')
      }
    },
    async getUserInfo(id) {
      let res = await this.axios.get(`users/${id}`)
      console.log(res)
      if (res.meta.status === 200) {
        let rid = res.data.rid
        if (rid === -1) {
          rid = ''
        }
        this.assignForm.rid = rid
      }
    },
    async showAssignDialog(user) {
      // 显示对话框
      this.assignDialogVisible = true
      // 回显数据
      this.assignForm.id = user.id
      this.assignForm.username = user.username
      // 根据 ID 查询角色
      this.getUserInfo(user.id)
      // 获取角色列表
      let res = await this.axios.get('roles')
      let { meta: { status }, data } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    async assignRole() {
      // 表单校验
      if (!this.assignForm.rid) {
        this.$message.error('请选择一个角色')
        return
      }
      await this.axios.put(`users/${this.assignForm.id}/role`, {
        rid: this.assignForm.rid
      })
      // 角色分配成功，重置表单，隐藏弹框，重新渲染页面，提示信息
      this.$refs.assignForm.resetFields()
      this.assignDialogVisible = false
      this.getUserList()
      this.$message.success('角色分配成功')
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 300px;
  margin-bottom: 5px;
}
</style>
