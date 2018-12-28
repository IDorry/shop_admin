<template>
  <div class="goods">
    <!-- 添加商品按钮 -->
    <el-button type="success" plain>添加商品</el-button>
    <!-- 表格 -->
    <el-table :data="goodsList">
      <el-table-column type="index" :index="indexMethod"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="{row}">
          {{row.add_time | datefilter}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      query: '',
      pageSize: 10,
      currentPage: 1,
      total: 0
    }
  },
  methods: {
    async getGoodsList() {
      let res = await this.axios.get('goods', {
        params: {
          query: this.query,
          pagesize: this.pageSize,
          pagenum: this.currentPage
        }
      })
      let { meta: { status }, data: { goods, total } } = res
      if (status === 200) {
        this.goodsList = goods
        this.total = total
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getGoodsList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getGoodsList()
    },
    indexMethod(index) {
      return index + 1 + (this.currentPage - 1) * this.pageSize
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>

<style>
</style>
