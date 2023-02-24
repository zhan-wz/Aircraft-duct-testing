<template>
  <div class="app-container">
    <audio id="audioId" autoplay ></audio> 
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="检测工件计数">
        <el-col :span="4">
          {{ this.form.total }}
        <!-- {{ form.detecte }} -->
        </el-col>
      </el-form-item>
      <el-form-item label="原始采样图片">
        <div class="box imgbox">
          <div class="item" v-for="(k,v) in form.oriImg">
            <el-image :src=k class="item img"></el-image>
            <!-- <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image> -->
          </div>
        </div>
      </el-form-item>
      <el-form-item label="检测输出图片">
        <div class="box">
          <div class="item" v-for="(k,v) in form.markImg">
            <el-image :src=k class="item img"></el-image>
            <!-- <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image> -->
          </div>
        </div>
      </el-form-item>
      <el-form-item label="检测结果">
        <div class="box">
          <div class="item" v-for="(k,v) in form.defectType" :key="k">
            <div v-if="(typeof k === 'string')">
              <el-tag class="tag" :type="k | statusFilter">{{ k }}</el-tag>
            </div>
            <div v-else v-for="(item,index) in k" :key="item">
              <el-tag class="tag row" :type="item | statusFilter">{{ item }}</el-tag>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="检测结果计数">
        <div class="box">
          <div class="item" v-for="(k,v) in form.result" :key="k">
            <!-- {{ k.label }} : <el-input-number :value="k.value" :disabled="true"></el-input-number> -->
            {{ k.label }} : {{ k.value }} 次
          </div>
        </div>
      </el-form-item>
      <el-form-item label="本次检测结果">
        <el-col :span="4">
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
import { MessageBox, Message } from 'element-ui'
import { getList, getTotal } from '@/api/form'

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
        // img: [
        //   'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        //   'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        //   'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        //   'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        //   'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
        // ],
        // img_out: [
        //   'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        //   'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        //   'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        //   'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
        //   'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png'
        // ],
        total: 1, //检测工件数
        oriImg: [],
        markImg: [],
        // defectType: ['检测合格','划痕缺陷',['压坑缺陷','裂纹缺陷','腐蚀缺陷','裂纹缺陷'],'腐蚀缺陷','裂纹缺陷'],
        defectType: [],
        result: [
          {
            label: '检测合格',
            value: '50'
          },
          {
            label: '划痕缺陷',
            value: '50'
          },
          {
            label: '压坑缺陷',
            value: '50'
          },
          {
            label: '腐蚀缺陷',
            value: '50'
          },
          {
            label: '裂纹缺陷',
            value: '50'
          }
        ],
        detecte: ''
      },
      total: 1,
      audio: 1,
      flag: false, // 有缺陷为TRUE
      time: ''
    }
  },
  created(){
    this.fetchData()
    this.fetchTotal()
    // this.playAudio()
  },
  mounted() {
    console.log('mounted');
    
    this.time = setInterval(() => {
      // console.log('我是定时执行');//我是定时执行
      getList().then(response => {
        let data = response.data
        if(data.length !== 0) {
          // 普通函数定时器 this 指向 window 拿不到data
          // 箭头函数定时器 this 依赖外层函数 外层的this指向谁 就是谁
          // console.log('=========data[0].id----------',data[0].id);
          // console.log('===========定时器中的 this-----------',this.total);
          
          if(data[0].id != this.total) {
            // this.form.defectType = []
            // this.form.oriImg = []
            // this.form.markImg = []
            // this.form.detecte = ''
            this.form.total++
            this.total = data ? data[0].id : 1
            // console.log('----------新加了任务-----------');
          }
        }
      })
    },1000);
  },
  beforeDestroy() {
    console.log('组件销毁前 0000000000000000');
    this.form.defectType = []
    this.form.oriImg = []
    this.form.markImg = []
    this.form.detecte = ''
    clearInterval(this.time);
  },
  watch: {
    total: {
      handler(newValue, oldValue){  //newValue 新的值，oldValue变化前的值
        console.log("--------监听数据-- 新数据-------",newValue)
        console.log('------------监听数据 ------------ 老数据----------',oldValue);
        if(oldValue !== 1){
          console.log('-------不是第一次---------');
          setTimeout(() => {
            this.form.defectType = []
            this.form.oriImg = []
            this.form.markImg = []
            this.form.detecte = ''
            this.fetchData()
            this.flag = false   
            this.fetchTotal()
          }, 3000)
          // clearTimeout(setT)
        }
      },
      // deep: true
    },
    audio: {
      handler(newV,oldV) {
        console.log('-------------监听语音播报---------');
        this.playAudio()
      }
    }
  },
  methods: {
    fetchData() {
      // 处理非检测结果计数
      getList().then(response => {
        console.log('new接口',response.data);
        if (response.data.length !== 0) {
          let data = response.data
          this.total = data ? data[0].id : 1
          this.audio++
          data.forEach(element => {
            this.form.defectType.push(this.detectFromat(element))
            this.form.oriImg.push(`http://localhost/api/OriImage/${element.pid}`)
            this.form.markImg.push(`http://localhost/api/MarkImage/${element.pid}`)
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
        // this.playAudio()
      })
    },
    // 定时器
    
    // 处理结果计数
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
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
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
.el-form-item {
    margin-bottom: 10px;
}
.row {
  float: left;
  margin:0 2px 2px 0;
}
.img {
  /* width: 70%;
  height: 50%; */
  display: block;
  width: 500px;
  height: 300px;
}
</style>

