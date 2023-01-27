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
      <el-table-column label="任务名称">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="示例图片" width="220" align="center">
        <template slot-scope="scope">
          <img :src=scope.row.author class="image" >
        </template>
      </el-table-column>
      <!-- <el-table-column label="Pageviews" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.pageviews }}
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" label="检测结果" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.create_time }}</span>
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
import { getList } from '@/api/table'
import moment from 'moment'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '检测合格': 'success',
        // draft: 'gray',
        '划痕缺陷': 'danger',
        '压坑缺陷': 'danger',
        '腐蚀缺陷': 'danger',
        '裂纹缺陷': 'danger'
      }
      return statusMap[status]
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
        this.list = response.data.items
        this.listLoading = false
      })
    },
    // 分页 -- 1/28 完成
    handleSizeChange(val) {
      this.pageSize = val
    },
    handleCurrentChange(val) {
      this.page = val
    },
    // 时间筛选 -- 1/28 完成
    filterData() {
      let date = []
      if(this.datePicker) {
        // 筛选日期格式化处理
        this.datePicker.forEach(i => {
          date.push(moment(i).format('YYYY-MM-DD HH:mm:ss')) //"2019-04-13 16:46:40"
        });
        // 动态筛选
        this.list = this.list.filter((i)=>{
          return i.create_time < date[1] && i.create_time > date[0]
        })
      } else {
        this.fetchData()
      }

      // this.listLoading = true
      // getList().then(response => {
      //   // 类别是status status: "压坑缺陷"; 日期是 create_time create_time: "2003-12-22 07:08:57"
      //   // response.data.items
      //   console.log("监听日期",);
      // })
    },
    /**
    filterLabel() {
      if(this.labelPicker) {
        console.log('if true', this.labelPicker);
        this.list = this.fetchData().filter(i => {
          return this.labelPicker.includes(i.status)
        })
      } else {
        console.log('if false', this.labelPicker);
        this.fetchData()
      }

      console.log('标签筛选', this.labelPicker);
      console.log('筛选后的',this.list);
    },
    */
    // 标签筛选 -- 1/28 完成 （可优化）
    handleFilter() {
      this.loadingFilter = true
      this.list = this.list.filter((i)=>{
        return this.labelPicker.includes(i.status)
      })
      this.loadingFilter = false
    
      console.log('标签筛选', this.labelPicker);
      console.log('筛选后的',this.list);
    }
  }
}
</script>
<style>
.image {
    width: 100%;
    display: block;
  }
</style>
