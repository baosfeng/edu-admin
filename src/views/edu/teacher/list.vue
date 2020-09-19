<template>
  <div id="box">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="讲师名"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
            v-model="searchObj.begin"
            default-time="00:00:00"
            placeholder="选择开始时间"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="searchObj.end"
            default-time="00:00:00"
            placeholder="选择截止时间"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>

      <el-button icon="el-icon-search" type="primary" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table :data="list" border fit highlight-current-row>
      <!-- 序号 -->
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">{{ (page - 1) * limit + scope.$index + 1 }}</template>
      </el-table-column>
      <!-- 名称 -->
      <el-table-column label="名称" prop="name" width="80"/>
      <!-- 头衔 -->
      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">{{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}</template>
      </el-table-column>
      <!-- 资历 -->
      <el-table-column label="资历" prop="intro"/>
      <!-- 添加时间 -->
      <el-table-column label="添加时间" prop="gmtCreate" width="160"/>
      <!-- 排序 -->
      <el-table-column label="排序" prop="sort" width="60"/>
      <!-- 操作 -->
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button icon="el-icon-edit" size="mini" type="primary">修改</el-button>
          </router-link>
          <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="removeDataById(scope.row.id)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        :current-page="page"
        :page-size="limit"
        :total="total"
        layout="total, prev, pager, next, jumper"
        style="padding: 30px 0; text-align: center;"
        @current-change="fetchData"
    />
  </div>
</template>

<script>
import teacher from "@/api/edu/teacher";

export default {
  data() {
    // 定义数据
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 2, // 每页记录数
      searchObj: {}, // 查询条件
    };
  },

  created() {
    // 当页面加载时获取数据
    this.fetchData();
  },

  methods: {
    fetchData(page = 1) {
      // 调用api层获取数据库中的数据
      this.page = page;
      teacher
          .getPageList(this.page, this.limit, this.searchObj)
          .then((response) => {
            console.log(response);
            // debugger 设置断点调试
            if (response.success === true) {
              this.list = response.data.page.records;
              this.total = response.data.page.total;
            }
          });
    },
    resetData() {
      this.searchObj = {};
      this.fetchData();
    },
    removeDataById(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
          .then(() => {
            return teacher.deleteTeacherById(id);
          })
          .then(() => {
            this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          })
          .catch((response) => {
            // 失败
            if (response === "cancel") {
              this.$message({
                type: "info",
                message: "已取消删除",
              });
            } else {
              this.$message({
                type: "error",
                message: "删除失败",
              });
            }
          });
    },
  },
};
</script>
