<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色按钮 -->
    <el-button type="success" plain @click="showAddDialog">添加角色</el-button>
    <!-- 表格组件 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <!-- 显示一级分类 -->
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag @close="delRight(row, l1.id)" closable>{{l1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 显示二级分类 -->
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag @close="delRight(row, l2.id)" closable>{{l2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 显示三级分类 -->
                  <span v-for="l3 in l2.children" :key="l3.id">
                    <el-tag @close="delRight(row, l3.id)" closable class="l3" type="warning">{{l3.authName}}</el-tag>
                  </span>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" plain icon="el-icon-edit" size="mini" @click="showEditDialog(row)"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="delRole(row.id)"></el-button>
          <el-button type="success" plain icon="el-icon-check" @click="showAssignDialog(row)" size="mini">
            分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配角色对话框 -->
    <el-dialog title="角色授权" :visible.sync="assignDialogVisible" width="40%">
      <!-- 树形菜单 -->
      <el-tree ref="tree" :data="data" node-key="id" :props="defaultProps" show-checkbox default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="assignRight">分配</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 + 编辑角色对话框 -->
    <el-dialog :title="this.addForm.id? '修改角色' : '添加角色'" :visible.sync="addDialogVisible" width="40%">
      <el-form ref="addForm" :model="addForm" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色名称" v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取消</el-button>
        <el-button type="primary" @click="saveRole">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleList: [],
      assignDialogVisible: false,
      data: [],
      defaultProps: {
        // 指定子树为节点对象的某个属性值
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      addDialogVisible: false,
      addForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getRoleList() {
      let res = await this.axios.get('roles')
      let { data, meta: { status } } = res
      if (status === 200) {
        this.roleList = data
      }
    },
    // 点×删除权限
    async delRight(role, rightId) {
      let res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      let { meta: { status }, data } = res
      if (status === 200) {
        role.children = data
        this.$message.success('取消权限成功')
      } else {
        this.$message.info('取消权限失败')
      }
    },
    async showAssignDialog(role) {
      // 保存当前角色id
      this.roleId = role.id
      // 显示对话框
      this.assignDialogVisible = true
      // 发请求获取数据，树状
      let res = await this.axios.get('rights/tree')
      console.log(res)
      let { meta: { status }, data } = res
      if (status === 200) {
        this.data = data
      }
      // 让节点选中
      // 找到当前角色有拥有的所有的三级权限
      let ids = []
      role.children.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            ids.push(l3.id)
          })
        })
      })
      // 设置选中的项
      this.$refs.tree.setCheckedKeys(ids)
    },
    async assignRight() {
      // 获取所有选中的项的id
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      let rids = checkedKeys.concat(halfCheckedKeys).join()
      // 发请求，项数据库添加选中的项
      let res = await this.axios.post(`roles/${this.roleId}/rights`, { rids })
      let { meta: { status } } = res
      if (status === 200) {
        this.getRoleList()
        this.assignDialogVisible = false
        this.$message.success('分配权限成功')
      } else {
        this.$message.error('失败')
      }
    },
    showAddDialog() {
      this.addDialogVisible = true
      // 重置模态框
      this.addForm.id = ''
      this.addForm.roleName = ''
      this.addForm.roleDesc = ''
    },
    saveRole() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 添加和编辑不同的地方
        // ajax---请求方式不同 post put
        //         请求地址不同 roles  roles/:id
        //         成功状态码不同 201   200
        let id = this.addForm.id
        let method = id ? 'put' : 'post'
        let url = id ? `roles/${id}` : 'roles'
        let status = id ? 200 : 201

        // 发送ajax
        let res = await this.axios({
          method,
          url,
          data: this.addForm
        })
        if (res.meta.status === status) {
          // 重置表单
          this.$refs.addForm.resetFields()
          // 隐藏对话框
          this.addDialogVisible = false
          // 重新渲染页面
          this.getRoleList()
          // 提示消息
          this.$message.success('操作成功')
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    showEditDialog(role) {
      this.addDialogVisible = true
      // 回显数据
      this.addForm.id = role.id
      this.addForm.roleName = role.roleName
      this.addForm.roleDesc = role.roleDesc
    },
    async delRole(id) {
      try {
        // 提示
        await this.$confirm('确定要删除吗?', '温馨提示', {
          type: 'warning'
        })
        // 发送ajax删除数据
        let res = await this.axios.delete(`roles/${id}`)
        if (res.meta.status === 200) {
          this.getRoleList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        // 点击取消按钮执行此处
        this.$message.info('取消删除')
      }
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style lang="less" scoped>
.l1 {
  border-bottom: 1px dotted #ccc;
  padding: 10px 0;
}

.l2 {
  margin-bottom: 5px;
}

.l3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
