import request from '@/utils/request'

const api_name = '/edu_teacher/subject'

export default {

	getNestedTreeList() {
		return request({
			url: `${api_name}`,
			method: 'get'
		})
	}
}
