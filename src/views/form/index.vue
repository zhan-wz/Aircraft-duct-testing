<template>
  <div class="app-container">
    <audio id="audioId" autoplay ></audio> 
    <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="120px">
      <el-form-item>
        <template slot="label">
          <div class="label">令号</div>
        </template>
        <el-input v-model="formInline.name" :disabled="true" style="width: 400px;"></el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="label">图号</div>
        </template>
        <el-autocomplete
          v-model="formInline.state"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入图号"
          @select="handleSelect"
          style="width: 400px; margin-right: 100px;"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="onSubmit">上传</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item class="el-form-item">
        <template slot="label">
          <div class="label">工件计数</div>
        </template>
        <el-col :span="4" class="content">
          {{ this.form.total }}
        <!-- {{ form.detecte }} -->
        </el-col>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="label">采样图片</div>
        </template>
        <div class="box imgbox">
          <div class="item" v-for="(k,v) in form.oriImg">
            <el-image :src=k class="item img" :preview-src-list=[k]></el-image>
            <!-- <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image> -->
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="label">输出图片</div>
        </template>
        <div class="box">
          <div class="item" v-for="(k,v) in form.markImg">
            <el-image :src=k class="item img" :preview-src-list=[k]></el-image>
            <!-- <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image> -->
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="label">检测结果</div>
        </template>
        <div class="box">
          <div class="item content" v-for="(k,v) in form.defectType" :key="k">
            <div v-if="(typeof k === 'string')">
              <el-tag class="tag" :type="k | statusFilter">{{ k }}</el-tag>
            </div>
            <div v-else v-for="(item,index) in k" :key="item">
              <el-tag class="tag row" :type="item | statusFilter">{{ item }}</el-tag>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="label">结果计数</div>
        </template>
        <div class="box">
          <div class="item content" v-for="(k,v) in form.result" :key="k">
            <!-- {{ k.label }} : <el-input-number :value="k.value" :disabled="true"></el-input-number> -->
            {{ k.label }} : {{ k.value }} 次
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <div class="label">检测结果</div>
        </template>
        <el-col :span="4" class="content">
          {{ this.form.detecte }}
        <!-- {{ form.detecte }} -->
      </el-col>
        <!-- 检测结果播报 相当于检测一轮 听到1个语音播报 检测合格/工件有缺陷-->
        <!-- <el-button type="primary" @click="playAudio" >播放</el-button> -->
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import qualified from '../../../static/audio/检测合格.mp3'
import error from '../../../static/audio/error.mp3'
import { Message } from 'element-ui'
import { getList, getID, getTotal, postData } from '@/api/form'

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
      img:'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
      form: {
        total: this.$store.state.form.total, //检测工件数
        oriImg: [],
        markImg: [],
        // defectType: ['检测合格','划痕缺陷',['压坑缺陷','裂纹缺陷','腐蚀缺陷','裂纹缺陷'],'腐蚀缺陷','裂纹缺陷'],
        defectType: [],
        result: [],
        detecte: ''
      },
      formInline: {
        name: '', //令号
        pname: '', //图号
        state: '',
      },      
      restaurants: [], // 图号数据库
      id: 0,
      audio: 1,
      flag: false, // 有缺陷为TRUE
      time: '' // 定时器
    }
  },
  created(){
    this.fetchData()
    this.fetchTotal()
  },
  watch: {
    id: {
      handler(newValue, oldValue) {
        if (oldValue !== 0) {
          this.form.defectType = []
          this.form.oriImg = []
          this.form.markImg = []
          this.form.detecte = ''
          this.fetchData()
          this.flag = false // 在这一步将flase置为false
          this.fetchTotal()

          // 数据获取完了 且 更新展示在页面了 清空定时器
          clearInterval(this.time)
        }
      }
    },
    audio(newV, oldV) {
      // 语音播报
      this.playAudio()
    }
  },
  mounted() {
    console.log('mounted');
    // 拿到图号的数据
    this.restaurants = this.loadAll();
    // 消息弹窗
    //从store中取值 
    if (this.$store.state.form.tname == '') {
      this.$prompt('请输入令号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '令号格式不正确'
      }).then(({ value }) => {
        //将value存在store中   if 判断store是否有值 消息弹窗弹出
        this.$store.commit("SET_NAME",value)
        this.formInline.name = value
        this.$message({
          type: 'success',
          message: '您输入的令号是: ' + value
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入，令号为空将无法进行检测任务'
        });       
      });
    } else {
      this.formInline.name = this.$store.state.form.tname
    }
  },
  beforeDestroy() {
    console.log('组件销毁前 0000000000000000');
    this.form.defectType = []
    this.form.oriImg = []
    this.form.markImg = []
    this.form.detecte = ''
  },
  methods: {
    // 数据刷新获取
    fetchData() {
      // 改变最新的ID
      getID().then(res => {
        this.id = res.data.id
      })
      // 获取最新一次检测任务
      getList().then(response => {
        console.log('new接口',response.data);
        if (response.data.length !== 0) {
          let data = response.data
          // this.total = data ? data[0].id : 1
          this.audio++
          data.forEach(element => {
            this.form.defectType.push(this.detectFromat(element))
            this.form.oriImg.push(`http://localhost:8080/api/OriImage/${element.pid}`)
            this.form.markImg.push(`http://localhost:8080/api/MarkImage/${element.pid}`)
          });
          console.log('new返回数据form',this.form);
          this.form.defectType.forEach(item => {
            if(item[0] == '划痕缺陷'|| item[0] == '压坑缺陷' || item[0] == '腐蚀缺陷' || item[0] == '裂纹缺陷') {
              this.flag = true
            }
          })
          if(this.flag) {
            this.form.detecte = '工件有缺陷'
          } else {
            this.form.detecte = '检测合格'
            this.flag = false
          }
        } else {
          Message({
            message: '检测算法还未处理完成，请稍后刷新数据',
            type: 'error'
          })
        }
      })
    },
    // 图号数据
    loadAll() {
      return [
        { "value": "1", "address": "长宁区新渔路144号" },
        { "value": "2HB--223", "address": "上海市长宁区淞虹路661号" },
        { "value": "3JK-sa", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { "value": "HBK-ui-98", "address": "天山西路438号" },
        { "value": "89", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        { "value": "HBK-ssui-98", "address": "上海市长宁区金钟路633号" },
        { "value": "KOASd", "address": "上海市嘉定区曹安公路曹安路1685号" },
        { "value": "H6K-5107-010-18", "address": "上海市普陀区同普路1435号" },
        { "value": "H6K-5207-010-18", "address": "上海市北翟路1444弄81号B幢-107" },
        { "value": "H6K-5307-010-18", "address": "上海市嘉定区新郁路817号" },
        { "value": "H6K-5407-010-18", "address": "嘉定区曹安路1611号" }
      ];
    },
    // 模糊搜索
    querySearchAsync(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handleSelect(item) {
      this.formInline.pname = item.value
      console.log('令号，图号',this.formInline);
    },
    
    // 处理检测结果计数
    fetchTotal() {
      getTotal().then(response => {
        console.log('total接口', response.data);
        this.form.result = this.detectTotal(response.data)
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
    // 检测结果计数
    detectTotal(item) {
      let arr = []
      if(item.def1 != 0){
        arr.push({label:'划痕缺陷',value: item.def1})
      }
      if(item.def2 != 0){
        arr.push({label:'压坑缺陷',value: item.def2})
      }
      if(item.def3 != 0){
        arr.push({label:'腐蚀缺陷',value: item.def3})
      }
      if(item.def4 != 0){
        arr.push({label:'裂纹缺陷',value: item.def4})
      }
      if(item.def0 != 0){
        arr.push({label:'检测合格',value: item.def0})
      }
      return arr
    },
    onSubmit() {
      if (this.formInline.name != '' && this.formInline.pname != '') {
        this.$message({
          message: '令号，图号 提交成功!',
          type: 'success'
        })
        var formData = new FormData();
        formData.append("name", this.formInline.name);
        formData.append("pname", this.formInline.pname);
        postData(formData).then(response => {
          if(response.code == 200){
            // 图号 令号 上传成功
            // 开始监听msg
            this.time = setInterval(() => {
              getID().then(response => {
                let data = response.data
                if(data.id !== this.id) {
                  this.$store.commit("SET_TOTAL") // 检测工件数+1 
                  this.form.total = this.$store.state.form.total
                  this.id = data.id
                }
              })
            },1000)
          }
        })
      } else {
        this.$message({
        message: '请检查令号和图号格式!',
        type: 'error'
      })
      }
    },
    playAudio() {
      // Fixfox和chrome不支持自动播放 Edge可以
      let audio = document.getElementById("audioId");
      if (this.form.detecte == '检测合格') {
        audio.src = qualified
      } else {
        audio.src = error
      }
      audio.play()
    }
  }
}
</script>

<style scoped>
.app-container{
  background-color: #dee6f0;
}
.box{
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
}
/* .imgbox{
  height: auto;
} */
.item{
  flex: 1;
  padding-right: 10px;
}

.line{
  text-align: center;
}
/* .el-form-item{
  background-color:#b6d6f7;
} */
.label {
  /* margin-bottom: 5px; */
  font-size: 17px;
  font-family:"微软雅黑";
}
.content {
  font-size: 17px;
  font-family:"STZhongsong";
}
.tag{
  font-size: 17px;
  font-family:"STZhongsong";
}
.row {
  float: left;
  margin:0 2px 2px 0;
  font-size: 17px;
  font-family:"STZhongsong";
}
.img {
  /* width: 70%;
  height: 50%; */
  display: block;
  height: 300px;
}
.el-form-item {
  margin-bottom: 12px;
}
</style>

