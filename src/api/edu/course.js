import request from '@/utils/request'

const api_name = '/edu_teacher/course'

export default {
    saveCourseInfo(courseInfo) {
        return request({
            url: `${api_name}/save-course-info`,
            method: 'post',
            data: courseInfo
        })
    }
}
