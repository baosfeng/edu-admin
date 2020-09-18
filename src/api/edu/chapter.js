import request from '@/utils/request'

const api_name = '/edu_teacher/chapter'

export default {

    getNestedTreeList(courseId) {
        return request({
            url: `${api_name}/nested-list/${courseId}`,
            method: 'get'
        })
    }
}