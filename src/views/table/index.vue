<template>
  <div class="app-container">
    <div class="block" style="margin: 0 8px 20px 8px ; ">
      <!--类别筛选-->
      <el-select v-model="labelPicker" multiple placeholder="请选择检测类别, 支持多选" style="width: 395px; margin-right: 15px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button el-button type="primary" icon="el-icon-search" :loading="loadingFilter" @click="handleFilter">查询</el-button>
      <el-autocomplete
        v-model="name"
        :fetch-suggestions="queryNameSearchAsync"
        placeholder="请输入令号"
        @select="handleNameSelect"
        style="width: 255px;margin-right: 15px; margin-left: 25px;"
      ></el-autocomplete>
      <el-autocomplete
        v-model="pname"
        :fetch-suggestions="queryPnameSearchAsync"
        placeholder="请输入图号"
        @select="handlePnameSelect"
        style="width: 255px;margin-right: 15px;"
      ></el-autocomplete>
      <el-button type="success" icon="el-icon-circle-close" :loading="loadingClearFilter" @click="handleClearFilter">重置</el-button>

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
        <template slot-scope="scope" >
          <div v-for="(k,v) in scope.row.pId" >
            <el-image :src=k  class="image" :preview-src-list=[k]></el-image>
          </div>
          <!-- <img :src=scope.row.pId class="image" > -->
        </template>
      </el-table-column>
      <el-table-column label="令号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.batch }}
        </template>
      </el-table-column>
      <el-table-column label="图号" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.pName }}
        </template>
      </el-table-column>
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
import myImgout1 from '../../../static/img_out/1.jpg'
import myImgout2 from '../../../static/img_out/2.jpg'
import myImgout3 from '../../../static/img_out/3.jpg'
import myImgout4 from '../../../static/img_out/4.jpg'
import myImgout5 from '../../../static/img_out/5.jpg'
import myImgout6 from '../../../static/img_out/6.jpg'
import myImgout7 from '../../../static/img_out/7.jpg'
import myImgout8 from '../../../static/img_out/8.jpg'
import myImgout9 from '../../../static/img_out/9.jpg'
import myImgout10 from '../../../static/img_out/10.jpg'
import myImgout11 from '../../../static/img_out/11.jpg'
import myImgout12 from '../../../static/img_out/12.jpg'
import myImgout13 from '../../../static/img_out/13.jpg'
import myImgout14 from '../../../static/img_out/14.jpg'
import myImgout15 from '../../../static/img_out/15.jpg'

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
      list: [{taskId:1,pId: [myImgout1,myImgout2,myImgout3,myImgout4,myImgout5],defectType: ['划痕缺陷','压坑缺陷'],createTime:'2023-01-01 00:00:00',batch:'架次1-0102',pName:'导管1-0102'},
            {taskId:2,pId: [myImgout6,myImgout7,myImgout8,myImgout9,myImgout10],defectType: ['划痕缺陷','压坑缺陷'],createTime:'2023-02-01 00:00:00',batch:'架次2-0202',pName:'导管2-0202'},
            {taskId:3,pId: [myImgout11,myImgout12,myImgout13,myImgout14,myImgout15],defectType: ['划痕缺陷'],createTime:'2023-03-01 00:00:00',batch:'架次3-0302',pName:"导管3-0302"}
          ],
      loadingFilter: false,
      loadingClearFilter: false,
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
      name: '', 
      pname: '', 
      nameResult: [
        { "value": "架次1-0102", "address": "上海市长宁区淞虹路661号" },
        { "value": "架次2-0202", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { "value": "架次3-0302", "address": "天山西路438号" },
        { "value": "架次4-0402", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        { "value": "架次5-0502", "address": "上海市长宁区金钟路633号" },
        { "value": "架次6-0602", "address": "上海市嘉定区曹安公路曹安路1685号" },
        { "value": "架次7-0702", "address": "上海市普陀区同普路1435号" },
        { "value": "架次8-0802", "address": "上海市北翟路1444弄81号B幢-107" },
        { "value": "架次9-0902", "address": "上海市嘉定区新郁路817号" },
        { "value": "架次10-1002", "address": "嘉定区曹安路1611号" }
      ],// 令号 从数据库中拿
      pnameResult: [
        { "value": "导管1-0102", "address": "上海市长宁区淞虹路661号" },
        { "value": "导管2-0202", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { "value": "导管3-0302", "address": "天山西路438号" },
        { "value": "导管4-0402", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        { "value": "导管5-0502", "address": "上海市长宁区金钟路633号" },
        { "value": "导管6-0602", "address": "上海市嘉定区曹安公路曹安路1685号" },
        { "value": "导管7-0702", "address": "上海市普陀区同普路1435号" },
        { "value": "导管8-0802", "address": "上海市北翟路1444弄81号B幢-107" },
        { "value": "导管9-0902", "address": "上海市嘉定区新郁路817号" },
        { "value": "导管10-1002", "address": "嘉定区曹安路1611号" }
      ],// 图号 从数据库中拿
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

  destroyed() {
    this.list = null
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
    /**
     * 令号查询
     */
    // 令号模糊搜索
    queryNameSearchAsync(queryString, cb) {
      var nameResult = this.nameResult
      var totalResult = queryString ? nameResult.filter(this.createNameStateFilter(queryString)) : nameResult
      cb(totalResult) // 下拉显示的菜单项
    }, 
    createNameStateFilter(queryString) {
      return (name) => {
        return (name.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    handleNameSelect(item) {
      this.name = item.value
      console.log("要查询的令号",this.name);
      this.loadingFilter = true
      if(this.name.length !== 0) {
        this.list = this.list.filter((i)=>{
          return i.batch == this.name     
        })
      } else {
        this.fetchData()
      }
      this.loadingFilter = false
    },
    /**
     * 图号查询
     */
    // 图号模糊搜索
    queryPnameSearchAsync(queryString, cb) {
      var pnameResult = this.pnameResult;
      var totalPResult = queryString ? pnameResult.filter(this.createPnameStateFilter(queryString)) : pnameResult
      cb(totalPResult)
    },
    handlePnameSelect(item) {
      this.pname = item.value
      console.log('要查询的图号',this.pname);
      this.loadingFilter = true
      if(this.pname.length !== 0) {
        this.list = this.list.filter((i)=>{
          return i.pName == this.pname     
        })
      } else {
        this.fetchData()
      }
      this.loadingFilter = false
    },
    createPnameStateFilter(queryString) {
      return (name) => {
        return (name.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
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
    // 重置
    handleClearFilter() {
      this.loadingClearFilter = true
      // 获取所有数据
      this.list = this.fetchData()
      // 清空所有筛选条件
      // this.labelPicker = []
      this.name = '',
      this.pname = '',
      // this.datePicker = []
      this.loadingClearFilter = false
    }
  }
}
</script>
<style>
.image {
    display: block;
    float: left;
    width: 209.5px;
    height: 180px;
    margin-right: 5px;
    /* margin-left: auto; 
    margin-right: auto; */
  }
</style>
