<template>
  <div class="app-container">
    <div class="block" style="margin: 0 8px 20px 8px ; ">
      <!--类别筛选-->
      <el-select v-model="labelPicker" multiple placeholder="请选择检测类别, 支持多选" style="padding-right:20px; width: 500px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" :loading="loadingFilter" @click="handleFilter">查询</el-button>

      <div style="float:right;"> 
        <!--时间日期筛选-->
        <el-date-picker
          v-model="datePicker"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </div>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list ? list.slice((page-1)*pageSize,pageSize*page) : list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="任务ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.taskId }}
        </template>
      </el-table-column>
      <el-table-column label="采样图片" align="center">
        <template slot-scope="scope">
          <img :src=scope.row.pId class="image" >
          
        </template>
      </el-table-column>
      <!-- <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" label="检测结果" width="110" align="center">
        <template slot-scope="scope">
          <div class="item" v-for="(k,v) in scope.row.defectType" :key="k">
            <div v-if="(typeof k === 'string')">
              <el-tag class="tag" :type="k | statusFilter" style="margin-top: 5px;">{{ k }}</el-tag>
            </div>
            <div v-else v-for="(item,index) in k" :key="item" >
              <el-tag class="tag row" :type="item | statusFilter" >{{ item }}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align: center; margin-top: 8px;">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="list ? list.length : 0"
        style="display: inline-block;"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getLabel, getList, getPic, getDate } from '@/api/table'
import { isTSMethodSignature } from '@babel/types'
import moment from 'moment'

export default {
  filters: {
    statusFilter(defectType) {
      const statusMap = {
        '检测合格': 'success',
        // draft: 'gray',
        '划痕缺陷': 'danger',
        '压坑缺陷': 'danger',
        '腐蚀缺陷': 'danger',
        '裂纹缺陷': 'danger'
      }
      return statusMap[defectType]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      loadingFilter: false,
      // 日期快捷选择
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
          }]
      },
      datePicker: '',
      // 标签选项
      options: [{
          value: '检测合格',
          label: '检测合格'
        }, {
          value: '裂纹缺陷',
          label: '裂纹缺陷'
        }, {
          value: '压坑缺陷',
          label: '压坑缺陷'
        }, {
          value: '腐蚀缺陷',
          label: '腐蚀缺陷'
        }, {
          value: '划痕缺陷',
          label: '划痕缺陷'
        }],
      labelPicker: [],
      page: 1, // 当前页号
      pageSize: 10, // 每页的记录数
    }
  },

  created() {
    this.fetchData()
  },

  watch:{
    // 不监听 后端传参
    datePicker: {
      handler: 'filterData'
    },
    // labelPicker: {
    //   handler: 'filterLabel'
    // }
  },
  
  methods: {
    fetchData() {
      this.listLoading = true
      getList().then(response => {
        // this.list = response.data.items
        console.log('返回数据',response);
        this.list = response.data
        this.list.forEach(item => {
          item.defectType = this.detectFromat(item) 
          item.pId = `http://localhost/api/MarkImage/${item.pId}` // this.getPicture(item.pId)
          console.log('item-------',item);
          // awiat getPic一下
        })
        this.listLoading = false
      })
    },
    // 缺陷类型转化
    detectFromat(item) {
      let arr = []
      if(item.def1 != 0){
        arr.push('划痕缺陷')
      }
      if(item.def2 != 0){
        arr.push('压坑缺陷')
      }
      if(item.def3 != 0){
        arr.push('腐蚀缺陷')
      }
      if(item.def4 != 0){
        arr.push('裂纹缺陷')
      }
      if(arr.length == 0){
        arr.push('检测合格')
      }
      return arr
    },
    // 分页 -- 1/28 完成
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.page = val
    },
    // 时间筛选 -- 1/28 完成 --- 前端实现
    filterData() {
      let date = []
      if(this.datePicker) {
        // 筛选日期格式化处理
        this.datePicker.forEach(i => {
          date.push(moment(i).format('YYYY-MM-DD HH:mm:ss')) //"2019-04-13 16:46:40"
        });
        // 动态筛选
        this.list = this.list.filter((i)=>{
          return i.createTime < date[1] && i.createTime > date[0]
        })
      } else {
        this.fetchData()
      }
    },
    
    // 时间筛选 ---- 2/25完成 ---- 后端接口实现
    // handleFilterData()  {
    //   let date = []
    //   if(this.datePicker) {
    //     // 筛选日期格式化处理
    //     this.datePicker.forEach(i => {
    //       date.push(moment(i).format('YYYY-MM-DD HH:mm:ss')) //"2019-04-13 16:46:40"
    //     });
    //     let jsonDate = JSON.stringify({beginDate: date[0],endDate: date[1]})
    //     console.log('===========jsonDate=======',jsonDate);
    //     this.listLoading = true
    //     getDate(jsonDate).then(res => {
    //       console.log('--------res-------',res.data);
    //       this.list = res.data
    //       this.list.forEach(item => {
    //         item.defectType = this.detectFromat(item) 
    //         item.pId = `http://localhost/api/OriImage/${item.pId}` // this.getPicture(item.pId)
    //         console.log('item-------',item);
    //         // awiat getPic一下
    //       })
    //       this.listLoading = false
    //     })
    //   }
    // },

    // 标签筛选 -- 1/28 完成 （可优化）
    handleFilter() {
      this.loadingFilter = true
      if(this.labelPicker.length !== 0) {
        this.list = this.list.filter((i)=>{
          return i.defectType.filter(x => this.labelPicker.includes(x)).length == 0 ? false : true      
        })
      } else {
        this.fetchData()
      }
      this.loadingFilter = false
    },

    // 标签筛选 --- 2/27完成（后端调用 有问题）
    // handleFilter() {
    //   console.log('========this.labelPicker=======',this.labelPicker);
    //   let arrLable = []
    //   this.labelPicker.forEach(label => {
    //     if(label == '划痕缺陷') {
    //       arrLable.push('def1')
    //     }
    //     if(label == '压坑缺陷') {
    //       arrLable.push('def2')
    //     }
    //     if(label == '腐蚀缺陷') {
    //       arrLable.push('def3')
    //     }
    //     if(label == '裂纹缺陷') {
    //       arrLable.push('def4')
    //     }
    //     if(label == '检测合格') {
    //       arrLable.push('def0')
    //     }
    //   })
    //   console.log('========arrLable=======',arrLable);
      
    //   let jsonLable = JSON.stringify({defect: arrLable})
    //   console.log('------------jsonLable---------',jsonLable);
    //   this.listLoading = true
    //   getLabel(jsonLable).then(res => {
    //     console.log('--------res-------',res.data);
    //     this.list = res.data
    //     this.list.forEach(item => {
    //       item.defectType = this.detectFromat(item) 
    //       item.pId = `http://localhost/api/OriImage/${item.pId}` // this.getPicture(item.pId)
    //       console.log('item-------',item);
    //       // awiat getPic一下
    //     })
    //     this.listLoading = false
    //   })
    // }
  }
}
</script>
<style>
.image {
    width: 246px;
    height: 180px;
    display: block;
    margin-left: auto; 
    margin-right: auto;
  }
</style>
