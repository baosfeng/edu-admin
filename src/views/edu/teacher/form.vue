<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" controls-position="right"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button icon="el-icon-upload" type="primary" @click="imagecropperShow=true">更换头像</el-button>
        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
            v-show="imagecropperShow"
            :key="imagecropperKey"
            :height="300"
            :url="BASE_API+'/edu_oss/oss'"
            :width="300"
            field="file"
            @close="close"
            @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherJS from "@/api/edu/teacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: {ImageCropper, PanThumb},
  data() {
    return {
      teacher: {
        name: "",
        sort: 0,
        level: 1,
        career: "",
        intro: "",
        avatar: "",
      },
      saveBtnDisabled: false, // 保存按钮是否禁用,
      BASE_API: process.env.BASE_API, // 接口API地址
      imagecropperShow: false, // 是否显示上传组件
      imagecropperKey: 0, // 上传组件id
    };
  },

  methods: {
    // 上传成功后的回调函数
    cropSuccess(data) {
      this.imagecropperShow = false;
      this.teacher.avatar = data.url;
      // 上传成功后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },

    // 关闭上传组件
    close() {
      this.imagecropperShow = false;
      // 上传失败后，重新打开上传组件时初始化组件，否则显示上一次的上传结果
      this.imagecropperKey = this.imagecropperKey + 1;
    },
    saveOrUpdate() {
      this.saveBtnDisabled = true;
      if (!this.teacher.id) {
        this.saveData();
      } else {
        this.updateData();
      }
    },
    // 保存
    saveData() {
      teacherJS
          .save(this.teacher)
          .then((response) => {
            return this.$message({
              type: "success",
              message: "保存成功!",
            });
          })
          .then((resposne) => {
            // 添加成功，返回列表页面
            this.$router.push({path: "/edu/teacher"});
          })
          .catch((response) => {
            this.$message({
              type: "error",
              message: "保存失败",
            });
          });
    },
    // 根据id查询记录
    fetchDataById(id) {
      teacherJS
          .getById(id)
          .then((response) => {
            this.teacher = response.data.item;
          })
          .catch((response) => {
            this.$message({
              type: "error",
              message: "获取数据失败",
            });
          });
    },
    updateById(teacher) {
      return request({
        url: `${api_name}/${teacher.id}`,
        method: "put",
        data: teacher,
      });
    },
    // 根据id更新记录
    updateData() {
      // 保存按钮开启
      this.saveBtnDisabled = true;
      teacherJS
          .updateById(this.teacher)
          .then((response) => {
            return this.$message({
              type: "success",
              message: "修改成功!",
            });
          })
          .then((resposne) => {
            this.$router.push({path: "/edu/teacher"});
          })
          .catch((response) => {
            this.$message({
              type: "error",
              message: "保存失败",
            });
          });
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.fetchDataById(id);
        console.log(id);
      } else {
        // 使用对象拓展运算符，拷贝对象，而不是引用，
        // 否则新增一条记录后，defaultForm就变成了之前新增的teacher的值
        this.teacher = {};
      }
    },
  },
  created() {
    this.init();
  },
  watch: {
    //监听
    $route(to, from) {
      //路由变化方式，路由发生变化，方法就会执行
      this.init();
    },
  },
};
</script>
