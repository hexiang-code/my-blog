const colorArray = ["#91bef0","#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]
const bgColorArray = ["#f5f6f7", "#2f3136"]
const hardwareTitle = [
  {
    props: 'cpuTemp',
    label: 'cpu温度'
  },
  {
    props: 'cpuUseage',
    label: 'cpu使用率'
  },
  {
    props: 'cpuMaxClocks',
    label: 'cpu最大频率'
  },
  {
    props: 'cpuPowers',
    label: 'cpu功耗'
  },
  {
    props: 'diskTemp',
    label: '硬盘温度'
  },
  {
    props: 'diskUseage',
    label: '硬盘使用率'
  },
  {
    props: 'ssdDiskTemp',
    label: '固态硬盘温度'
  },
  {
    props: 'ssdDiskUseage',
    label: '固态硬盘使用率'
  },
  {
    props: 'memUseage',
    label: '内存使用率'
  },
  {
    props: 'createdAt',
    label: '创建时间'
  }
]
const loggerTitle = [
  {
    props: 'userId',
    label: '用户id'
  },
  {
    props: 'userAccount',
    label: '用户账户'
  },
  {
    props: 'url',
    label: '请求地址'
  },
  {
    props: 'method',
    label: '请求方式'
  },
  {
    props: 'params',
    label: '请求参数'
  },
  {
    props: 'time',
    label: '请求耗时'
  },
  {
    props: 'token',
    label: '用户token'
  },
  {
    props: 'mode',
    label: '用户身份'
  },
  {
    props: 'error',
    label: '错误信息'
  },
  {
    props: 'createdAt',
    label: '发生时间',
    sortable: true
  }
]

export {
  loggerTitle,
  hardwareTitle,
  bgColorArray,
  colorArray
}
