import request from '@/utils/request'

const api_name = '/edu_teacher/course'

export default {
	getCoursePublishInfoById(id) {
		return request({
			url: `${api_name}/course-publish-info/${id}`,
			method: 'get'
		})
	},

	publishCourse(id) {
		return request({
			url: `${api_name}/publish-course/${id}`,
			method: 'put'
		})
	}
}
