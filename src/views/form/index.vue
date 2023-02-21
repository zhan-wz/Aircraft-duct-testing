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
        <div class="box">
          <div class="item" v-for="(k,v) in form.oriImg">
            <el-image :src=k class="item"></el-image>
            <!-- <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image>
            <el-image :src=img class="item"></el-image> -->
          </div>
        </div>
      </el-form-item>
      <el-form-item label="检测输出图片">
        <div class="box">
          <div class="item" v-for="(k,v) in form.markImg">
            <el-image :src=k class="item"></el-image>
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
      }
    }
  },
  created(){
    this.fetchData()
    this.fetchTotal()
  },
  mounted() {
    console.log('mounted');
    this.playAudio()
  },
  methods: {
    fetchData() {
      // 处理非检测结果计数
      getList().then(response => {
        console.log('new接口',response.data);
        let data = response.data
        data.forEach(element => {
          this.form.defectType.push(this.detectFromat(element))
          this.form.oriImg.push(`http://localhost/api/OriImage/${element.pid}`)
          this.form.markImg.push(`http://localhost/api/MarkImage/${element.pid}`)
        });
        console.log('返回数据form',this.form);
        if(this.form.defectType.indexOf('检测合格') !== -1){
          this.form.detecte = '检测合格'
        } else {
          this.form.detecte = '工件有缺陷'
        }
      })
    },

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
      if(arr == []){
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
      if (this.form.detecte === '检测合格') {
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
</style>

