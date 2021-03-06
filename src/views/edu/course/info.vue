<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" align-center process-status="wait" style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <!-- 表单 -->
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
            v-model="courseInfo.subjectParentId"
            placeholder="请选择"
            @change="subjectLevelOneChanged"
        >
          <el-option
              v-for="subject in subjectNestedList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
              v-for="subject in subSubjectList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
            v-model="courseInfo.lessonNum"
            :min="0"
            controls-position="right"
            placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <el-input v-model="courseInfo.description" :height="300"/>
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
            :action="BASE_API+'/edu_oss/oss/'"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :show-file-list="false"
            class="avatar-uploader"
        >
          <img :src="courseInfo.cover" width="200px;"/>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
            v-model="courseInfo.price"
            :min="0"
            controls-position="right"
            placeholder="免费课程请设置为0元"
        />
        元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from "@/api/edu/course";
import subject from "@/api/edu/subject";
import teacher from "@/api/edu/teacher";

const defaultForm = {
  title: "",
  subjectId: "",
  teacherId: "",
  lessonNum: 0,
  description: "",
  cover: "/static/wv_156795324395412.jpg",
  price: 0,
};

export default {
  data() {
    return {
      courseInfo: defaultForm,
      saveBtnDisabled: false, // 保存按钮是否禁用
      subjectNestedList: [], //一级分类列表
      subSubjectList: [], //二级分类列表
      teacherList: [], // 讲师列表
      BASE_API: process.env.BASE_API, // 接口API地址
      courseId: "",
    };
  },

  watch: {
    $route(to, from) {
      this.init();
    },
  },

  created() {
    //初始化所有讲师
    this.initTeacherList();
    //初始化一级分类
    this.initSubjectList();
    //获取路由id值
    if (this.$route.params && this.$route.params.id) {
      //调用根据id查询课程的方法
      this.init();
    } else {
      this.courseInfo = {...defaultForm};
    }
  },

  methods: {
    init() {
      const id = this.$route.params.id;
      //根据id获取课程基本信息
      course.getCourseInfoById(id).then((response) => {
        this.courseInfo = response.data.item;
        let parentSubjectId = this.courseInfo.subjectParentId;
        this.subjectNestedList.forEach((value) => {
          if (value.id === parentSubjectId) {
            this.subSubjectList = value.children;
          }
        });
      });
    },
    // 初始化课程列表
    initSubjectList() {
      subject.getNestedTreeList().then((response) => {
        this.subjectNestedList = response.data.items;
      });
    },
    // 初始化讲师列表
    initTeacherList() {
      teacher.getList().then((response) => {
        this.teacherList = response.data.items;
      });
    },
    // 第一级列表被点击之后
    subjectLevelOneChanged(value) {
      console.log(value);
      for (let i = 0; i < this.subjectNestedList.length; i++) {
        if (this.subjectNestedList[i].id === value) {
          this.subSubjectList = this.subjectNestedList[i].children;
          this.courseInfo.subjectId = "";
        }
      }
    },
    next() {
      this.saveBtnDisabled = true;
      if (!this.courseInfo.id) {
        this.saveData();
      } else {
        this.updateData();
      }
    },

    // 保存
    saveData() {
      course
          .saveCourseInfo(this.courseInfo)
          .then((response) => {
            this.$message({
              type: "success",
              message: "保存成功!",
            });
            return response; // 将响应结果传递给then
          })
          .then((response) => {
            this.$router.push({
              path: "/edu/course/chapter/" + response.data.courseId,
            });
          })
          .catch((response) => {
            this.$message({
              type: "error",
              message: response.message,
            });
          });
    },

    updateData() {
      this.saveBtnDisabled = true;
      course
          .updateCourseInfoById(this.courseInfo)
          .then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            return response; // 将响应结果传递给then
          })
          .then((response) => {
            this.$router.push({
              path: "/edu/course/chapter/" + response.data.courseId,
            });
          })
          .catch((response) => {
            this.$message({
              type: "error",
              message: "保存失败",
            });
          });
    },
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url;
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
  },
};
</script>
