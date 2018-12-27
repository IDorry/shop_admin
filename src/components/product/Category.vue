<template>
  <div class="category">
    <el-button type="success" plain @click="showAddDialog">商品分类</el-button>
    <!-- 商品列表 -->
    <el-table :data="categoryList" style="40%" v-loading="loading" element-loading-text="拼命加载中" element-loading-background="rgba(255,255,255)">
      <el-table-tree-column
      label="分类名称"
      prop="cat_name"
      tree-key="cat_id"
      parent-key="cat_pid"
      level-key="cat_level"
      :indent-size="20"
      ></el-table-tree-column>
      <el-table-column label="是否删除">
        <template slot-scope="{row}">{{row.cat_deleted ? '是' : '否'}}</template>
      </el-table-column>
      <el-table-column label="层级" prop="cat_level"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 15, 20, 25]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background>
    </el-pagination>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="40%">
      <el-form :model="addForm" ref="addForm" label-width="80px" :rules="rules">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input placeholder="请输入分类名称" v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            :options="options"
            v-model="addForm.cat_pid"
            :props="props"
            change-on-select
            clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryList: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      addDialogVisible: false,
      addForm: {
        cat_pid: [],
        cat_name: '',
        cat_level: ''
      },
      options: [],
      props: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      loading: true
    }
  },
  methods: {
    async getCategoryList() {
      this.loading = true
      let res = await this.axios.get('categories', {
        params: {
          type: 3,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let { meta: { status }, data: { result, total } } = res
      if (status === 200) {
        this.loading = false
        this.categoryList = result
        this.total = total
      }
    },
    async showAddDialog() {
      this.addDialogVisible = true

      // 加载两级商品分类数据
      let res = await this.axios.get('categories?type=2')
      if (res.meta.status === 200) {
        this.options = res.data
      }
    },
    addCategory() {
      // 表单验证
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        // 发送axios请求，添加商品分类
        let { cat_pid: catPid, cat_name: catName } = this.addForm
        let res = await this.axios.post('categories', {
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        })
        if (res.meta.status === 201) {
          this.$refs.addForm.resetFields()
          this.addDialogVisible = false
          this.$message.success('分类添加成功')
          this.getCategoryList()
        } else {
          this.$message.error('分类添加失败')
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCategoryList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCategoryList()
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style>
</style>
