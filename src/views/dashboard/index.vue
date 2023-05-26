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
import myImg1 from '../../../static/img/1.jpg'
import myImg2 from '../../../static/img/2.jpg'
import myImg3 from '../../../static/img/3.jpg'
import myImg4 from '../../../static/img/4.jpg'
import myImg5 from '../../../static/img/5.jpg'
import myImg6 from '../../../static/img/6.jpg'
import myImg7 from '../../../static/img/7.jpg'
import myImg8 from '../../../static/img/8.jpg'
import myImg9 from '../../../static/img/9.jpg'
import myImg10 from '../../../static/img/10.jpg'

import myImgout1 from '../../../static/img_out/1.png'
import myImgout2 from '../../../static/img_out/2.png'
import myImgout3 from '../../../static/img_out/3.png'
import myImgout4 from '../../../static/img_out/4.png'
import myImgout5 from '../../../static/img_out/5.png'
import myImgout6 from '../../../static/img_out/6.png'
import myImgout7 from '../../../static/img_out/7.png'
import myImgout8 from '../../../static/img_out/8.png'
import myImgout9 from '../../../static/img_out/9.png'
import myImgout10 from '../../../static/img_out/10.png'

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
        total: 1, //检测工件数
        oriImg: [myImg1,myImg2,myImg3,myImg4,myImg5],
        markImg: [myImgout1,myImgout2,myImgout3,myImgout4,myImgout5],
        // defectType: ['检测合格','划痕缺陷',['压坑缺陷','裂纹缺陷','腐蚀缺陷','裂纹缺陷'],'腐蚀缺陷','裂纹缺陷'],
        defectType: ['划痕缺陷','划痕缺陷','划痕缺陷','划痕缺陷','压坑缺陷'],
        result: [{label:'划痕缺陷',value: 4},{label:'压坑缺陷',value: 1}],
        detecte: '工件有缺陷'
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
  
  watch: {
    
    audio(newV, oldV) {
      // 语音播报
      this.playAudio()
    }
  },
  mounted() {
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
      // 获取最新一次检测任务
      // this.total = data ? data[0].id : 1
      this.audio++
      this.form.oriImg = [myImg6,myImg7,myImg8,myImg9,myImg10]
      this.form.markImg = [myImgout6,myImgout7,myImgout8,myImgout9,myImgout10]
      this.form.defectType = ['压坑缺陷','压坑缺陷','压坑缺陷','划痕缺陷','划痕缺陷']
      this.form.result = [{label:'划痕缺陷',value: 2},{label:'压坑缺陷',value: 3}],
      this.form.defectType.forEach(item => {
        if(item == '划痕缺陷'|| item == '压坑缺陷' || item == '腐蚀缺陷' || item == '裂纹缺陷') {
          this.flag = true
        }
      })
      if(this.flag) {
        this.form.detecte = '工件有缺陷'
      } else {
        this.form.detecte = '检测合格'
        this.flag = false
      }
    },
    // 图号数据
    loadAll(){
      return [
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
   
    onSubmit() {
      if (this.formInline.name != '' && this.formInline.pname != '') {
        this.$message({
          message: '令号，图号 提交成功!',
          type: 'success'
        })
        this.form.total++
        this.id=this.id + 1
        this.form.defectType = []
        this.form.oriImg = []
        this.form.markImg = []
        this.form.detecte = ''
        this.fetchData()
        this.flag = false // 在这一步将flase置为false
      }
    },
    playAudio() {
      // Fixfox和chrome不支持自动播放 Edge可以
      let audio = document.getElementById("audioId");
      if (this.form.detecte == '检测合格') {
        console.log("判断为true");
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

