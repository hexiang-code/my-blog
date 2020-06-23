const tabsConfig = {
    tabsSelectIcon: require('../../assets/status-icon/leimu-icon-shy.png')
}

const navgation = [
    {
        type: 'baidu',
        name: '网页',
        icon: '&#xe601;',
        action: 'https://www.baidu.com/s',
        formName: 'wd'
    },
    {
        type: 'bilibili',
        name: '视频',
        icon: '&#xe605;',
        action: 'https://search.bilibili.com/all',
        formName: 'keyword'
    }
]

export { tabsConfig, navgation }
