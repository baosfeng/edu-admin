import request from '@/utils/request'

export function login(username, password) {
	return request({
		url: '/edu_teacher/user/login',
		method: 'post',
		data: {
			username,
			password
		}
	})
}

export function getInfo(token) {
	return request({
		url: '/edu_teacher/user/info',
		method: 'get',
		params: {token}
	})
}

export function logout() {
	return request({
		url: '/edu_teacher/user/logout',
		method: 'post'
	})
}
