import request from '@/utils/request'

const api_name = '/edu_teacher/teacher'
export default {

    getPageList(page, limit, searchObj) {
        return request({
            url: `${api_name}/page/query/${page}/${limit}`,
            method: 'post',
            // 需要转为json使用data,需要使用参数方式使用param
            data: searchObj
        })
    },

    deleteTeacherById(id) {
        return request({
            url: `${api_name}/${id}`,
            method: 'delete',
        })
    },
    save(teacher) {
        return request({
            url: `${api_name}/save`,
            method: 'post',
            data: teacher
        })
    },
    getById(id) {
        return request({
            url: `${api_name}/${id}`,
            method: 'get'
        })
    },
    updateById(teacher) {
        return request({
            url: `${api_name}/${teacher.id}`,
            method: 'put',
            data: teacher
        })
    },
    getList() {
        return request({
            url: api_name,
            method: 'get'
        })
    },
}
