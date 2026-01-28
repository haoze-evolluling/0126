/**
 * 站点数据配置
 * 包含50个中国大陆主流网站
 */

const SITES_DATA = [
    { name: '百度', url: 'https://www.baidu.com', category: 'search', icon: 'search' },
    { name: '淘宝', url: 'https://www.taobao.com', category: 'ecommerce', icon: 'shopping-bag' },
    { name: '天猫', url: 'https://www.tmall.com', category: 'ecommerce', icon: 'store' },
    { name: '京东', url: 'https://www.jd.com', category: 'ecommerce', icon: 'package' },
    { name: '拼多多', url: 'https://www.pinduoduo.com', category: 'ecommerce', icon: 'percent' },
    { name: '腾讯网', url: 'https://www.qq.com', category: 'portal', icon: 'layout' },
    { name: '微信网页', url: 'https://weixin.qq.com', category: 'social', icon: 'message-circle' },
    { name: '新浪微博', url: 'https://weibo.com', category: 'social', icon: 'at-sign' },
    { name: '抖音', url: 'https://www.douyin.com', category: 'video', icon: 'video' },
    { name: '快手', url: 'https://www.kuaishou.com', category: 'video', icon: 'play' },
    { name: '哔哩哔哩', url: 'https://www.bilibili.com', category: 'video', icon: 'tv' },
    { name: '优酷', url: 'https://www.youku.com', category: 'video', icon: 'film' },
    { name: '爱奇艺', url: 'https://www.iqiyi.com', category: 'video', icon: 'monitor' },
    { name: '腾讯视频', url: 'https://v.qq.com', category: 'video', icon: 'video' },
    { name: '网易云音乐', url: 'https://music.163.com', category: 'music', icon: 'music' },
    { name: 'QQ音乐', url: 'https://y.qq.com', category: 'music', icon: 'headphones' },
    { name: '支付宝', url: 'https://www.alipay.com', category: 'finance', icon: 'credit-card' },
    { name: '招商银行', url: 'https://www.cmbchina.com', category: 'finance', icon: 'landmark' },
    { name: '中国银行', url: 'https://www.boc.cn', category: 'finance', icon: 'building-2' },
    { name: '知乎', url: 'https://www.zhihu.com', category: 'social', icon: 'help-circle' },
    { name: '小红书', url: 'https://www.xiaohongshu.com', category: 'social', icon: 'book-open' },
    { name: '豆瓣', url: 'https://www.douban.com', category: 'social', icon: 'bookmark' },
    { name: 'CSDN', url: 'https://www.csdn.net', category: 'tech', icon: 'code' },
    { name: '掘金', url: 'https://juejin.cn', category: 'tech', icon: 'gitlab' },
    { name: 'GitHub', url: 'https://github.com', category: 'tech', icon: 'github' },
    { name: 'StackOverflow', url: 'https://stackoverflow.com', category: 'tech', icon: 'layers' },
    { name: '阿里云', url: 'https://www.aliyun.com', category: 'cloud', icon: 'cloud' },
    { name: '腾讯云', url: 'https://cloud.tencent.com', category: 'cloud', icon: 'server' },
    { name: '华为云', url: 'https://www.huaweicloud.com', category: 'cloud', icon: 'database' },
    { name: '百度网盘', url: 'https://pan.baidu.com', category: 'storage', icon: 'hard-drive' },
    { name: '高德地图', url: 'https://ditu.amap.com', category: 'map', icon: 'map' },
    { name: '百度地图', url: 'https://map.baidu.com', category: 'map', icon: 'navigation' },
    { name: '携程', url: 'https://www.ctrip.com', category: 'travel', icon: 'plane' },
    { name: '去哪儿', url: 'https://www.qunar.com', category: 'travel', icon: 'compass' },
    { name: '飞猪', url: 'https://www.fliggy.com', category: 'travel', icon: 'ticket' },
    { name: '美团', url: 'https://www.meituan.com', category: 'o2o', icon: 'coffee' },
    { name: '饿了么', url: 'https://www.ele.me', category: 'o2o', icon: 'utensils' },
    { name: '滴滴', url: 'https://www.didiglobal.com', category: 'o2o', icon: 'car' },
    { name: '网易', url: 'https://www.163.com', category: 'portal', icon: 'mail' },
    { name: '搜狐', url: 'https://www.sohu.com', category: 'portal', icon: 'globe' },
    { name: '新浪', url: 'https://www.sina.com.cn', category: 'portal', icon: 'rss' },
    { name: '凤凰', url: 'https://www.ifeng.com', category: 'portal', icon: 'flag' },
    { name: '人民网', url: 'https://www.people.com.cn', category: 'news', icon: 'newspaper' },
    { name: '新华网', url: 'https://www.xinhuanet.com', category: 'news', icon: 'radio' },
    { name: '央视网', url: 'https://www.cctv.com', category: 'news', icon: 'tv-2' },
    { name: 'Office365', url: 'https://www.office.com', category: 'office', icon: 'file-text' },
    { name: '钉钉', url: 'https://www.dingtalk.com', category: 'office', icon: 'message-square' },
    { name: '飞书', url: 'https://www.feishu.cn', category: 'office', icon: 'send' },
    { name: '企业微信', url: 'https://work.weixin.qq.com', category: 'office', icon: 'users' }
];

// 去重处理
const UNIQUE_SITES = SITES_DATA.filter((v, i, a) => 
    a.findIndex(t => (t.name === v.name)) === i
);