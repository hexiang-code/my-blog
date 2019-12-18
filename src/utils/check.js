class CheckFun {
    constructor () {}

    /**
     * 校验用户信息完整性
     * 用户id,用户账号，用户名称为必填项
     * @param {Object} userInfo 用户信息
     */
    checkUserInfo (userInfo) {
        if (!userInfo.userId) {
            console.error('userId is required!')
            return false
        }

        if (!userInfo.userName) {
            console.log('userName is required!')
            return false
        }

        if (!userInfo.userAccount) {
            console.log('userAccount is required!')
            return false
        }
        return true
    }
}

export default new CheckFun()