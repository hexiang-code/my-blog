const userInfo = {
    name: '张三',
    age: 18,
    targetWork: '前端开发',
    personImage: require('../assets/person.png'),
    birthday: '19970308',
    adress: '安徽省合肥市',
    phone: '18715057130',
    email: '309871923@qq.com'
}

// const styleStr = '.instruction-content { width: 80%;display: flex; margin: 0 auto; justify-content: space-around;.instruction-left {width: 40%; height: 500px;border: 1px solid #5f5f5f; }.instruction-right { width: 40%; color: #000;border: 1px solid #5f5f5f;.header-instruction {padding: 20px;display: flex;height: 120px;.person-info {height: 120px;display: flex;.person-image { width: 60px;height: 120px;border: 1px solid #f5f5f5;}.person-info-right {padding: 0 20px;display: flex;flex-direction: column;justify-content: space-between;.person-name-top { height: 120px;.person-name {font-size: 26px;}}}}.email-phone {padding-left:  20px;display: flex;flex-direction: column;justify-content: space-between;}.logo-instruction {color: #fff;font-size: 20px;background-color: #FF6600;text-align: center;padding: 5px 0;border-radius: 10px;}}}}'
const styleStr = '.instruction-content {\
    width: 80%;\
    display: flex;\
    margin: 0 auto;\
    justify-content: space-around;\
}\
.instruction-left {\
    width: 40%;\
    border: 1px solid #5f5f5f;\
}\
.instruction-right {\
    width: 40%;\
    color: #000;\
    border: 1px solid #5f5f5f;\
}\
.header-instruction {\
    padding: 20px;\
    display: flex;\
    height: 120px;\
    justify-content: space-around;\
}\
.person-info {\
    height: 120px;\
    display: flex;\
}\
.person-image {\
    width: 60px;\
    height: 120px;\
    border: 1px solid #f5f5f5;\
}\
.person-info-right {\
    padding: 0 20px;\
    display: flex;\
    flex-direction: column;\
    justify-content: space-between;\
}\
.person-name-top {\
    height: 120px;\
}\
.person-name {\
    font-size: 26px;\
}\
.email-phone {\
    padding-left:  20px;\
    display: flex;\
    flex-direction: column;\
    justify-content: space-between;\
}\
.logo-instruction {\
    color: #fff;\
    font-size: 20px;\
    background-color: #FF6600;\
    text-align: center;\
    padding: 5px 0;\
    border-radius: 10px;\
}'

export { userInfo, styleStr }