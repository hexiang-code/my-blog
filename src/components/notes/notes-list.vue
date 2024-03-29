<script>
import request from '../../utils/http'
import { debounce, formatDate, getMillisecond } from '../../utils/utils'
let limitTimer = null // 限时更新的计时器
const dayToMs = getMillisecond(24) // 1天毫秒数
const hoursToMs = getMillisecond(1) // 1小时毫秒数
const minutesToMs = getMillisecond(0, 1) // 1分钟毫秒数
const secondToMs = getMillisecond(0, 0, 1) // 1秒毫秒数

export default {
  data () {
    return {
      notesCatalog: [], // 目录
      notesList: [], // 列表
      addCatalogWindow: false, // 新增目录弹框
      addCatalogText: '', // 目录
      updateCatalogId: '', // 修改目录id
      curSelCatalog: {}, // 当前选中的目录
      notesLabelList: [], // 笔记标签列表
      isVisiableNotesLabel: false, // 是否展开笔记标签窗口
      isVisiableNotesCatalog: false, // 是否展开笔记目录窗口
      delNotesLabelVisibel: false, // 是否展示笔记标签删除按钮
      addNotesLabelVisibel: false, // 是否展示新增笔记标签功能
      newNotesLabel: '', // 新增笔记标签名称
      notesLabelCtxMenu: [
        {
          label: '新增标签',
          clickCallback: () => {
            this.addNotesLabelVisibel = true
          }
        },
        {
          label: '删除标签',
          clickCallback: () => {
            this.delNotesLabelVisibel = true
          }
        }
      ], // 笔记标签右键菜单
      notesCatalogMenuList: [
        {
          label: '新增目录',
          clickCallback: () => {
            this.addCatalogWindow = true
          }
        }
      ], // 笔记目录右键菜单
      lastUpdateInfo: {
        id: '',
        updatedAt: ''
      }, // 最后一次更新时间
      diffLastUpdate: 0, // 现在与最后一次更新时间的差值

      todoCurPage: 1, // 待办列表当前页
      todoPageSize: 10, // 待办列表每页数量
      todoList: [], // 待办列表
      todoTotal: 1, // 待办总量
      todoComplete: 0, // 1：查询已完成待办项 0: 查询未完成待办项
      isShowAddTodoDialog: false, // 打开新增待办项弹框
      isMultiCompleteTodo: false, // 批量完成待办开关
      selectedTodoIds: [], // 批量选择的待办项
      // 新建待办项内容
      todoForm: {
        id: '', // 仅编辑时有
        name: '', // 待办名称
        content: '' // 待办内容
      },
      // 待办右键菜单
      todoMenuList: [
        {
          label: '新增待办',
          clickCallback: () => {
            this.isShowAddTodoDialog = true
          }
        },
        {
          label: '批量完成',
          clickCallback: () => {
            this.isMultiCompleteTodo = true
          }
        }
      ]
    }
  },
  watch: {
    // 新增笔记标签和删除笔记标签只能存在一个
    delNotesLabelVisibel (newVal) {
      if (newVal) this.addNotesLabelVisibel = false
    },
    // 新增笔记标签和删除笔记标签只能存在一个
    addNotesLabelVisibel (newVal) {
      if (newVal) this.delNotesLabelVisibel = false
    }
  },

  computed: {
    // 笔记最后一次更新时间
    lastUpdateTime () {
      let { updatedAt } = this.lastUpdateInfo
      return formatDate('YYYY-MM-DD hh:ss:mm', updatedAt)
    },

    // 催更文字-日
    diffLastUpdateDays () {
      let { diffLastUpdate } = this
      return Math.floor(diffLastUpdate / dayToMs)
    },

    // 催更文字-时
    diffLastUpdateHours () {
      let { diffLastUpdate } = this
      let _hours = (diffLastUpdate % dayToMs)
      return Math.floor(_hours / hoursToMs)
    },

    // 催更文字-分
    diffLastUpdateMinutes () {
      let { diffLastUpdate } = this
        let _minutes = (diffLastUpdate % dayToMs) % hoursToMs
        return Math.floor(_minutes / minutesToMs)
    },

    // 催更文字-秒
    diffLastUpdateSecond () {
      let { diffLastUpdate } = this
        let _second = ((diffLastUpdate % dayToMs) % minutesToMs)
        return Math.floor(_second / secondToMs)
    },
  },

  async created () {
    await this.getNotesCatalog()
    await this.getNotesList(this.curSelCatalog.id)
    this.getNotesLabel()
    this.getTodoList()
    this.updateLimitTime()
    this.modifyCatalog = debounce(function(item, type) {
      this.updateCatalog(item, type)
    }, 300, this)
  },

  destroyed() {
    window.clearTimeout(limitTimer)
  },

  render () {
    return (
      <div class="notes-body">
        <div class="notes-left">
          <div class="notes-catalog" ref="notes-catalog">
            <div class="add-catalog">
              <div title="鼠标右键呼出菜单">
                <i class="iconfont catalog-icon">&#xe6a5;</i>
                <span vCtxmenu={{ menuList: this.notesCatalogMenuList }}>文章列表</span>
              </div>
              <i class="iconfont notes-visiable-icon" vOpen={{target: this.$refs['notes-catalog']}}>&#xe67c;</i>
            </div>
            <div class="catalog-list">
              {this.notesCatalog.length > 0 ? this.createNotesCatalog() : ''}
            </div>
          </div>
          <div class="notes-label" ref="notes-label">
            <div class="header">
              <div vCtxmenu={{menuList: this.notesLabelCtxMenu}} title="鼠标右键呼出菜单">
                <i class="iconfont label-icon">&#xe7a5;</i>
                标签
              </div>
              <i class="iconfont notes-visiable-icon" v-open={{target: this.$refs['notes-label']}}>&#xe67c;</i>
            </div>
            <div class="content">
              {
                this.notesLabelList.map(item => {
                  return <span class={this.delNotesLabelVisibel ?  'label-item_delete' : 'label-item'}>
                    <span>{item.name}</span>
                    {
                      this.delNotesLabelVisibel
                      ? <i class="iconfont label-close" onClick={() => this.delNotesLabel(item.id)}>&#xe604;</i>
                      : ''
                    }
                  </span>
                })
              }
              {
                this.delNotesLabelVisibel
                  ? (
                      <div class="label-operation">
                        <span class="label-confirm" onClick={() => this.delNotesLabelVisibel = false}>确定</span>
                      </div>
                    )
                  : ''
              }
              {
                this.addNotesLabelVisibel
                  ? (
                    <div class="label-operation">
                      <input class="add-label" vModel={this.newNotesLabel} />
                      <span class="label-confirm" onClick={() => this.addNotesLabel()}>确定</span>
                      <span class="label-cancel" onClick={() => this.addNotesLabelVisibel = false}>取消</span>
                    </div>
                  )
                  : ''
              }
            </div>
          </div>
        </div>
        <div class="notes-center">
            <div class="notes-list">
              {this.notesList.length > 0 ? this.createNotesList() : ''}
            </div>
        </div>
        <div class="notes-right">
          <div class="limit-update">
            <div class="diff-update">
              <span>距离最后一次更新已经过去：</span>
              <div class="timer" vTips={{ content: `真是混掉了，${this.diffLastUpdateDays}天不更新你想干什么！` }}>
                {
                  typeof this.diffLastUpdateDays != 'undefined'
                    ? (
                        <transition name="second" >
                          <span class="date" key={this.diffLastUpdateDays}>{ this.diffLastUpdateDays }</span>
                        </transition>
                      )
                    : ''
                }
                <span>天</span>
                {
                  typeof this.diffLastUpdateHours != 'undefined'
                    ? (
                        <transition name="second" >
                          <span class="date" key={this.diffLastUpdateHours}>{ this.diffLastUpdateHours }</span>
                        </transition>
                      )
                    : ''
                }
                <span>时</span>
                {
                  typeof this.diffLastUpdateMinutes != 'undefined'
                    ?  (
                        <transition name="second" >
                          <span class="date" key={this.diffLastUpdateMinutes}>{ this.diffLastUpdateMinutes }</span>
                        </transition>
                      )
                    : ''
                }
                <span>分</span>
                {
                /*
                  {
                    this.diffLastUpdateSecond
                      ? (
                          <transition name="second">
                            <span class="date" key={this.diffLastUpdateSecond}>{ this.diffLastUpdateSecond }</span>
                          </transition>
                        )
                      : ''
                  }
                  <span>秒</span>
                */
                }
              </div>
            </div>
            <div class="last-update">
              <span>最后一次更新时间：</span>
              <span class="time">
              { this.lastUpdateTime }
              </span>
            </div>
          </div>
          <div class="todo" ref="todo">
            <div class="todo-header">
              <div title="鼠标右键呼出菜单">
                <i class="iconfont wirte-icon">&#xe712;</i>
                <span vCtxmenu={{ menuList: this.todoMenuList }}>待办列表</span>
              </div>
              <i class="iconfont notes-visiable-icon" vOpen={{target: this.$refs['todo']}}>&#xe67c;</i>
            </div>
            <div class="todo-tabs">
              <span class={[ 'tab-item', {'tab-item_active': this.todoComplete == 0} ]}
                onClick={() => !(this.todoComplete = 0) && this.getTodoList()}>
                未完成
              </span>
              <span class={[ 'tab-item', {'tab-item_active': this.todoComplete == 1} ]}
                onClick={() => (this.todoComplete = 1) && this.getTodoList()}>
                已完成
              </span>
            </div>
            <hx-tree
              ref="todo-list"
              tree={{ children: this.todoList }}
              renderKey={{ label: 'name' }}
              scopedSlots={
                {
                  operation: todoItem => {
                    return (
                      this.todoComplete == 0
                       ? (
                         <div class="operation">
                          <span class="complete-btn" onClick={ () => this.completeTodo([todoItem.id]) }>完成</span>
                          <span class="edit-btn" onClick={ () => this.eidtTodo(todoItem) }>编辑</span>
                         </div>
                        )
                       : ''
                    )
                  },
                  leafContent: todoItem => {
                    return (
                      <span vTips={{ content: todoItem.content }}>{ todoItem.name }</span>
                    )
                  }
                }
              }
              {
                ... {
                  on: {
                    'check-change': this.todoMultiSelect
                  }
                }
              }
              isShowCheckbox={this.isMultiCompleteTodo}>
            </hx-tree>
            <div class="todo-footer">
              {
                this.isMultiCompleteTodo
                  ? (
                    <div class="todo-left">
                      <span class="todo-confirm" onClick={() => this.confirmCompleteTodo()}>确定</span>
                      <span class="todo-cancel" onClick={() => this.isMultiCompleteTodo = false}>取消</span>
                    </div>
                  )
                  : ''
              }
              <hx-pagination
                pageSize={this.todoPageSize} currentPage={this.todoCurPage}
                {
                  ...{
                    on: {
                      'current-change': this.todoCurPageChange
                    }
                  }
                }
                total={this.todoTotal}
                layout="prev, pager, next"
              >
            </hx-pagination>
            </div>
          </div>
        </div>

        <hx-dialog
          dialogVisiable={this.addCatalogWindow}
          {
            ...{
                on: {
                  'update:dialog-visiable': this.closeWindow
                  }
              }
          }
          title='新增目录' onConfirm={() => this.addCatalog()}>
          <hx-form-item label="目录名" label-icon={require('../../assets/status-icon/leimu-icon.png')}>
            <input slot="default" class="catalog-input" vModel={this.addCatalogText} type="text" placeholder="请输目录名" />
          </hx-form-item>
        </hx-dialog>
        <hx-dialog
          dialogVisiable={this.isShowAddTodoDialog}
          title="新增待办项"
          onConfirm={ () => this.addDialogConfirm() }
          {
          ...{
              on: {
                'update:dialog-visiable': val => this.isShowAddTodoDialog = val
              }
            }
          }>
          <hx-form-item label="待办名称" label-icon={require('../../assets/status-icon/leimu-icon.png')}>
            <input slot="default" class="catalog-input" vModel={this.todoForm.name} type="text" placeholder="请输入待办名称" />
          </hx-form-item>
          <hx-form-item label="待办内容" label-icon={require('../../assets/status-icon/leimu-icon.png')}>
            <textarea slot="default" class="todo-dialog__textarea" vModel={this.todoForm.content} type="text" placeholder="请输入待办内容"></textarea>
          </hx-form-item>
        </hx-dialog>
      </div>
    )
  },

  methods: {
    // 创建目录
    createNotesCatalog () {
      return this.notesCatalog.map(item => {
        const menuList = [
          {
            label: (
              <div vVisitor>
                <i class="iconfont notes-icon">&#xe612;</i>
                <a>新增博文</a>
              </div>
            ),
            clickCallback: () => this.goEditNotes(item.id)
          },
          {
            label: (
              <div vVisitor>
                <i class="iconfont notes-icon">&#xe62e;</i>
                <a>修改目录</a>
              </div>
            ),
            clickCallback: () => this.modifyCatalog(item, 1)
          },
          {
            label: (
              <div vVisitor>
                <i class="iconfont notes-icon">&#xe62e;</i>
                <a>删除目录</a>
              </div>
            ),
            clickCallback: () => this.modifyCatalog(item, 2)
          }
        ]
        return (
          <div class="catalog-item">
            <div class={this.curSelCatalog.id === item.id ? 'catalog-title catalog_selected' : 'catalog-title'}
              onClick={() => this.selCatalog(item)}
              vCtxmenu={{menuList}}>
              {item.name}
            </div>
            <div class="catalog-btn">
              <div>
                <i class="iconfont notes-icon">&#xe658;</i>
                {item.notesNumber > 0 ? item.notesNumber + '篇' : '暂无'}
              </div>
            </div>
          </div>
        )
      })
    },

    // 创建目录列表
    createNotesList () {
      return this.notesList.map(item => {
        const noteItemCtxMenu = [
          {
            label: '删除笔记',
            clickCallback: () => {
              this.deleteNote(item)
            }
          }
        ]
        return (
          <div class="list-item">
            <div class="notes-item" title="鼠标右键呼出菜单" vCtxmenu={{menuList: noteItemCtxMenu}}>
              <a onClick={() => this.goDetail(item.id)}>{item.name}</a>
            </div>
            <div class="notes-info">
              <span>
                <i class="iconfont notes-icon" title="文章阅读量">&#xe64c;</i>
                888
              </span>
              <span>
                <i class="iconfont notes-icon" title="文章收藏量">&#xe6dc;</i>
                100
              </span>
            </div>
          </div>
        )
      })
    },

    closeWindow(val) {
      this.addCatalogWindow = val
    },

    // 进入详情
    goDetail (notesId) {
      this.$router.push({
        path: 'notesDetail',
        query: {
          notesId
        }
      })
    },

    // 选择目录
    selCatalog (item) {
      this.curSelCatalog = item
      this.getNotesList(item.id)
    },

    // 进入编辑页面
    goEditNotes (catalogId) {
      this.$router.push({
        path: 'editNotes',
        query: { catalogId }
      })
    },

    // 获取笔记目录
    async getNotesCatalog () {
      return request({
        url: 'notes/getNotesCatalog',
        method: 'GET'
      }).then(res => {
        this.notesCatalog = res.catalog
        this.lastUpdateInfo = res.lastUpdate
        if (this.notesCatalog && this.notesCatalog.length > 0) {
          this.curSelCatalog = this.notesCatalog[0]
        }
      })
    },

    // 获取笔记列表
    async getNotesList (catalogId) {
      return request({
        url: 'notes/getNotesList',
        method: 'GET',
        params: { catalogId }
      }).then(res => {
        this.notesList = res
      })
    },

    // 新增笔记目录
    addCatalog () {
      if (!this.addCatalogText) {
        this.$liveRem.showToast({text: '目录名字必填哦', type: 'error'})
      }
      // TODO 防暴击优化
      if (this.addCatalogCompelte == false) {
        this.$liveRem.showToast({text: '点击太快啦！', type: 'error'})
        return
      }
      let notesInfo = {
        name: this.addCatalogText,
        pid: 0,
        mdContent: '',
        htmlContent: '',
        type: 1
      }
      this.addCatalogCompelte = false
      request({
        url: 'notes/uploadNotes',
        method: 'POST',
        data: {notesInfo}
      }).then(() => {
          this.$liveRem.showToast({text: '目录建好啦', type: 'success'})
          this.getNotesCatalog()
      }).finally(() => this.addCatalogCompelte = true)
    },

    /**
     * 更新目录
     * @param {Object} catalog
     * @param {Number} type  2: 删除目录, 1：修改目录
     */
    updateCatalog (catalog, type) {
      let { id, name } = catalog
      if (type == 1) {
        this.addCatalogWindow = true
        this.addCatalogText = name
        return
      }
      if (type == 2) {
        let notesInfo = {
          id,
          disabled: 1
        }
        request({
          url: 'notes/updateNotes',
          method: 'POST',
          data: {notesInfo}
        }).then(() => {
          this.$liveRem.showToast({text: '又少了个目录哦', type: 'sad'})
          this.getNotesCatalog()
        })
      }
    },

    /**
     * 获取笔记标签列表
     */
    getNotesLabel () {
      request({
        url: 'notesLabel/getNotesLabelList',
        methods: 'GET',
        params: {
          curPage: -1
        }
      }).then(res => {
        this.notesLabelList = res.data.rows
      })
    },

    // 删除笔记标签
    delNotesLabel (noteLabelId) {
      request({
        url: 'notesLabel/deleteNotesLabel',
        method: 'POST',
        data: {
          noteLabelId
        }
      }).then(() => {
        this.getNotesLabel()
      })
    },

    // 新增笔记标签
    addNotesLabel () {
      request({
        url: 'notesLabel/addNotesLabel',
        method: 'POST',
        data: {
          name: this.newNotesLabel
        }
      }).then(() => {
        this.$liveRem.showToast({text: '新建笔记标签成功', type: 'success'})
        this.addNotesLabelVisibel = false
        this.getNotesLabel()
      })
    },

    // 删除单个笔记
    deleteNote (noteItem) {
      let notesInfo = {
        id: noteItem.id,
        disabled: 1
      }
      request({
        url: 'notes/updateNotes',
        method: 'POST',
        data: { notesInfo }
      }).then(() => {
        this.$liveRem.showToast({text: '删除成功'})
        this.getNotesList(this.curSelCatalog.id)
      })
    },

    // 限时更新
    updateLimitTime () {
      let { updatedAt } = this.lastUpdateInfo
      let currentTime = + new Date()
      let diff = currentTime - new Date(updatedAt)
      this.diffLastUpdate = diff
      limitTimer = setTimeout(() => {
        this.updateLimitTime()
      }, secondToMs)
    },

    // 获取代办列表
    async getTodoList () {
      let res = await request({
        url: 'todo/getTodoList',
        method: 'GET',
        params: {
          curPage: this.todoCurPage,
          pageSize: this.todoPageSize,
          complete: this.todoComplete
        }
      })
      this.todoList = res.data.rows
      this.$nextTick(() => {
        this.todoList.forEach(item => {
          if (this.selectedTodoIds.includes(item.id)) {
            this.$refs['todo-list'].setNodeStatus({id: item.id}, true)
          }
        })
      })
      this.todoTotal = res.data.count
    },

    // 待办列表分页变更
    todoCurPageChange (curPage) {
      this.todoCurPage = curPage
      this.getTodoList(curPage)
    },

    // 完成待办
    completeTodo (ids) {
      request({
        url: 'todo/multiOperation',
        method: 'POST',
        data: {
          isComplete: true,
          ids
        }
      }).then(() => {
        this.$liveRem.showToast({ text: '又达成了许多目标哦，加油', type: 'lovely' })
        this.getTodoList()
      })
    },

    // 批量选择待办
    todoMultiSelect (node) {
      let { selectedTodoIds } = this
      let { isCheck, id } = node
      if (isCheck) {
        if (!selectedTodoIds.includes(id)) selectedTodoIds.push(id)
      } else {
        let index = selectedTodoIds.findIndex(item => item == id)
        index > -1 && selectedTodoIds.splice(index, 1)
      }
    },

    // 批量完成待办确定按钮
    confirmCompleteTodo () {
      this.completeTodo(this.selectedTodoIds)
    },

    // 确认新增待办弹框
    addDialogConfirm () {
      const { name, content, id } = this.todoForm
      let data = { name, content }
      id && (data.id = id)
      request({
        url: `todo/${id ? 'updateTodo' : 'addTodo'}`,
        method: 'POST',
        data
      }).then(() => {
        this.$liveRem.showToast({ text: `${id ? '编辑' : '新建'}待办成功啦，要早点完成哦~`, type: 'lovely' })
        this.getTodoList()
        this.isShowAddTodoDialog = false
      })
    },

    eidtTodo ({ name, content, id }) {
      this.isShowAddTodoDialog = true
      this.todoForm.name = name
      this.todoForm.content = content
      this.todoForm.id = id
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../config/css/_globalStyle.scss';
  .notes-body {
    position: relative;
    display: flex;
    align-items: flex-start;
    width: 1300px;
    margin: 0 auto;
    height: 100%;
    z-index: 10;

    /deep/ .dialog-container {
      background: $background;
      background-attachment: fixed;

      .dialog__footer {
        button {
          background-color: unset;
        }
      }
    }

    .notes-left {
      display: flex;
      flex-direction: column;
      width: 300px;
      margin-top: 10px;
      flex-shrink: 0;

      .notes-catalog {
        position: relative;
        border-radius: 5px;
        height: auto;
        background-color: rgba($color: #fff, $alpha: $opacity);

        .catalog-list {
          position: relative;
          display: flex;
          flex-direction: column;
          max-height: 400px;
          margin-top: 10px;
          padding: 12px;
          overflow-y: auto;
        }

        .add-catalog {
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          width: 100%;
          font-size: 16px;
          font-weight: bold;
          border-bottom: 1px dashed #fff;
          cursor: pointer;

          .catalog-icon {
            width: 16px;
            height: 16px;
            margin-right: 12px;
            color: $theme-color;
          }
        }

        .catalog-item {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 5px;
          margin-bottom: 12px;

          .catalog-title {
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 16px;
            cursor: pointer;
          }

          .catalog_selected {
            color: $theme-color;
            font-weight: bold;
          }

          .catalog-title:hover {
            color: $theme-color;
          }

          .catalog-btn {
            margin-top: 5px;
            display: flex;
            justify-content: flex-end;

            div {
              display: flex;
              align-items: center;
              height: 16px;
              margin-right: 10px;
              font-weight: 300;
              font-size: 12px;
              cursor: pointer;
            }
          }
        }
      }

      .notes-label {
        margin-top: 12px;
        position: relative;
        background-color: rgba($color: #fff, $alpha: $opacity);
        border-radius: 5px;
        font-size: 14px;

        .header {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          font-size: 16px;
          border-bottom: 1px dashed #fff;
          font-weight: bold;

          .label-icon {
            width: 16px;
            height: 16px;
            margin-right: 12px;
            color: $theme-color;
          }
        }

        .content {
          display: flex;
          flex-wrap: wrap;
          padding: 16px 12px;
          max-height: 500px;
          overflow-x: hidden;
          overflow-y: auto;

          .label-item {
            position: relative;
            margin: 0 12px;
            padding: 12px 0;
            cursor: pointer;
          }

          .label-item::after {
            content: '';
            transition: all .6s;
            height: 4px;
            width: 0;
            border-radius: 1px;
            background-color: $theme-color;
          }

          .label-item:hover::after {
            content: '';
            position: absolute;
            bottom: 4px;
            left: 0;
            width: 100%;
          }

          .label-item_delete {
            display: flex;
            justify-content: space-between;
            margin-right: 12px;
            margin-top: 12px;
            padding: 8px;
            height: 16px;
            line-height: 16px;
            border: 1px solid #e9e9eb;
            background-color: #f5f5f5;
            border-radius: 5px;
          }

          .label-item_delete span, .label-item span {
            display: inline-block;
            max-width: 120px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }

          .label-close {
            margin-left: 8px;
            font-size: 16px;
            color: $theme-color;
            cursor: pointer;
          }

          .label-operation {
            margin-top: 12px;
            width: 100%;
          }

          .label-confirm, .label-cancel {
            display: inline-block;
            padding: 4px 12px;
            font-size: 12px;
            border-radius: 5px;
            cursor: pointer;
          }

          .label-confirm {
            background-color: $theme-color;
            color: #fff;
          }

          .label-cancel{
            margin-left: 12px;
            cursor: pointer;
            background-color: #fff;
            color: $theme-color;
            border: 1px solid $theme-color;
          }

          .add-label {
            margin-right: 12px;
            width: 100px;
            line-height: 20px;
            padding-left: 12px;
            border: 1px solid $theme-color;
            outline: none;
          }
        }
      }
    }

    .notes-center {
      flex: 1;
      margin-left: 10px;
      margin-top: 10px;
      min-height: 100vh;
      background-color: rgba($color: #fff, $alpha: $opacity);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.65);
      border-radius: 5px;

      .notes-list {
        flex: 1;
        padding: 20px;
        height: 100%;
        box-sizing: border-box;

        .list-item {
          padding-bottom: 20px;
          .notes-info {
            margin-top: 10px;
            span {
              margin-right: 10px;
              font-weight: 100;
            }
          }

          .notes-item {
            display: flex;
            flex-direction: column;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
          }

          .notes-item:hover {
            color: $theme-color;
          }
        }
      }
    }

    .notes-right {
      margin-left: 10px;
      width: 300px;
      margin-top: 10px;
      flex-shrink: 0;

      .limit-update {
        padding: 12px;
        border-radius: 5px;
        font-size: 16px;
        line-height: 30px;
        background-color: rgba($color: #fff, $alpha: $opacity);

        .diff-update {
          display: flex;
          flex-direction: column;

          .timer {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .date {
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 5px;
              width: 30px;
              height: 40px;
              background-color: $theme-color;
              color: #fff;
              font-size: 16px;
              border-radius: 3px;
            }

            .second-enter-active {
              animation: flip-card 1s cubic-bezier(0.455, 0.030, 0.515, 0.955) forwards;
            }
          }
        }

        .last-update {
          display: flex;
          flex-direction: column;
          margin-top: 20px;

          .time {
            text-align: right;
            font-size: 20px;
            font-weight: bold;
            animation: text-twinkle 3s infinite;
            color: #fff;
          }
        }
      }

      .todo {
        margin-top: 12px;
        padding: 0 12px;
        border-radius: 5px;
        background-color: rgba($color: #fff, $alpha: $opacity);

        .todo-header {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          font-size: 16px;
          border-bottom: 1px dashed #fff;
          font-weight: bold;

          .wirte-icon {
            width: 16px;
            height: 16px;
            margin-right: 12px;
            color: $theme-color;
          }
        }

        .todo-tabs {
          display: flex;

          .tab-item {
            width: 50%;
            padding: 12px;
            text-align: center;
            font-size: 16px;
            cursor: pointer;
          }

          .tab-item_active {
            color: $theme-color;
            font-weight: bold;
          }
        }

        /deep/ .tree-main {
          padding: 0;

          .tree-main__children-label {
            padding: 10px 0;
            box-sizing: border-box;
          }

          .operation {

            .complete-btn {
              color: $theme-color;
            }

            .edit-btn {
              color: $theme-color;
              margin-left: 20px;
            }
          }


        }

        .todo-list {
          position: relative;
          max-height: 300px;
          overflow-y: auto;
          overflow-x: hidden;

          .todo-item {
            box-sizing: border-box;
            position: relative;
            padding: 12px;
            cursor: pointer;
            width: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }

        .todo-footer {
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .todo-left {
            display: flex;
            flex: 1;

            .todo-confirm {
              width: 40px;
              height: 25px;
              line-height: 25px;
              text-align: center;
              color: #fff;
              background-color: $theme-color;
              border-radius: 2px;
              font-size: 12px;
              cursor: pointer;
            }

            .todo-cancel {
              @extend .todo-confirm;
              margin-left: 10px;
              background: none;
              border: 1px solid $theme-color;
              color: $theme-color;
            }
          }

          /deep/ .pagination {

            padding: 12px 0;

            .pagination-item  {
              min-width: 20px;
              height: 20px;
              font-size: 14px;
            }
          }
        }

      }
    }

    .notes-visiable-icon {
      width: 16px;
      height: 16px;
      color: $theme-color;
      cursor: pointer;
    }

    .catalog-input {
      width: 200px;
      height: 30px;
      padding-left: 20px;
      border: 1px solid #fff;
      color: #fff;
      background-color: transparent;
      outline: none;
      box-sizing: border-box;
    }

    .todo-dialog__textarea {
      box-sizing: border-box;
      margin-top: 20px;
      width: 200px;
      height: 100px;
      padding: 12px 20px;
      border: 1px solid #fff;
      color: #fff;
      background-color: transparent;
      outline: none;
      resize: none;
    }

    /deep/ .dialog-container {
      // background: #fff;

      .form-item {
        height: auto;

        .form-label {
          color: #fff;
        }
      }

      .dialog__footer {
        button {
          color: #fff;
        }
      }
    }
  }

  .tips__song-name {
    font-size: 14px;
    color: $theme-color;
    font-weight: bold;
    margin: 0 4px;
  }

</style>
