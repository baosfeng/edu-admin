import request from '@/utils/request'

const api_name = '/edu_oss/video'

export default {

	removeById(id) {
		return request({
			url: `${api_name}/${id}`,
			method: 'delete'
		})
	}
}
