<template>
    <div class="bg-wall">
        <vue-video-background :videoSrcMp4="soure" poster="../../assets/yourName.jpg">
        </vue-video-background>
        <form action="https://www.baidu.com/s" target="_blank" class="search-zone">
            <input type="image" alt="Submit" class="search-icon" @keyup.enter="submit" :src="(require('../../assets/iconfont/search-icon.png'))" >
            <input type="text" name="wd" class="search-input" autocomplete="off" />
		</form>
        <div class="icon-list">
            <img class="icon-item" src="../../assets/iconfont/txtEdit.png" alt="">
            <el-popover placement="left" title="书签" width="500" trigger="click">
                <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText"
                    class="bookmark-filter">
                </el-input>
                <el-tree :data="bookmark" 
                    :props="defaultProps" 
                    @node-click="clickBookmark" 
                    :highlight-current="true" 
                    :accordion="true"
                    :filter-node-method="filterNode"
                    ref="bookmarks">
                    </el-tree>
                <img class="icon-item" slot="reference" src="../../assets/iconfont/navigation.png" alt="">
            </el-popover>
        </div>
    </div>
</template>

<script>
import VueVideoBackground from 'vue-video-background'
import request from '../../utils/http'
const bookmark = [
    {
        label: '娱乐',
        children: [
            {
                label: 'bilibili',
                href: 'https://www.bilibili.com'
            }
        ]
    },
    {
        label: '工作',
        children: [
            {
                label: '百度',
                href: 'https://wwww.baidu.com'
            }
            
        ]
    }
]
export default {
    data() {
        return {
            bookmark: bookmark,  // 书签
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            filterText: '', //过滤关键字
            soure: require('../../assets/start-background-video.mp4'),  //动态壁纸资源
            test: '百度一下'
        }
    },

    components: {
        'vue-video-background': VueVideoBackground
    },

    created () {
        //请求书签内容
        this.getBookmarksData()
    },

   watch: {
      filterText(val) {
        this.$refs.bookmarks.filter(val);
      }
    },

    methods: {
        //点击书签
        clickBookmark(e) {
            if (e.href) {
                window.open(e.href, '_blank')
            }
        },

        filterNode(value, data) {
            if (!value) return true
            return data.label.indexOf(value) !== -1
        },

        //请求数钱内容
        getBookmarksData () {
            let url = 'http://49.233.148.29/api/bookmarks/getBookMarksContent'
            let method = 'GET'
            request({url, method: 'GET'}).then(res =>{
                let value = res.data.data
                this.bookmark = value.bookmarksData.children
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .bg-wall {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        overflow: hidden;
    }

    .search-zone {
        width: 360px;
        height: 100px;
        position: relative;
        display: flex;
        align-items: center;
        left: 10%;
        top: 8%;
    }

    .search-input {
        width: 300px;
        height: 100px;
        border-radius: 80px;
        border: 1px solid;
        opacity: 0.5;
        outline: none;
        text-align: center;
        padding: 0 80px;
        position: relative;
        z-index: 9;
        font-size: 20px;
    }

    .search-icon {
        width: 60px;
        height: 60px;
        position: absolute;
        left: 20px;
        z-index: 10;;
    }

    .icon-list {
        position: fixed;
        right: 0;
        top: 100px;
        width: 60px;
        text-align: center;
    }

    .icon-item {
        position: relative;
        margin-top: 30px;
        width: 40px;
        height: 40px;
        cursor: pointer;
    }

    .icon-item:hover {
        transform: scale(1.2);
    }

    .bookmark-filter {
        width: 200px;
        margin-bottom: 20px;
    }

    .bookmark-filter .el-input__inner {
        height: 30px;
        line-height: 30px;
        width: 100px;
    }

</style>