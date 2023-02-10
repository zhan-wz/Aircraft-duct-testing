<template>
  <div class="app-container">
    <audio id="audioId" autoplay ></audio> 
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="检测工件计数">
        <el-col :span="4">
          1
        <!-- {{ form.detecte }} -->
        </el-col>
      </el-form-item>
      <el-form-item label="原始采样图片">
        <div class="box">
          <el-image :src=img class="item"></el-image>
          <el-image :src=img class="item"></el-image>
          <el-image :src=img class="item"></el-image>
          <el-image :src=img class="item"></el-image>
          <el-image :src=img class="item"></el-image>
        </div>
      </el-form-item>
      <el-form-item label="检测输出图片">
        <div class="box">
          <el-image :src=img class="item"></el-image>
          <el-image :src=img class="item"></el-image>
          <el-image :src=img class="item"></el-image>
          <el-image :src=img class="item"></el-image>
          <el-image :src=img class="item"></el-image>
        </div>
      </el-form-item>
      <el-form-item label="检测结果">
        <div class="box">
          <div class="item" v-for="(k,v) in form.status" :key="k">
            <div v-if="(typeof k === 'string')">
              <el-tag class="tag" :type="k | statusFilter">{{ k }}</el-tag>
            </div>
            <div v-else v-for="(item,index) in k" :key="item">
              <el-tag class="tag" :type="item | statusFilter">{{ item }}</el-tag>
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
          检测合格/工件有缺陷
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
import scratch from '../../../static/audio/划痕缺陷.mp3'
import pit from '../../../static/audio/压坑缺陷.mp3'
import corrosion from '../../../static/audio/腐蚀缺陷.mp3'
import crack from '../../../static/audio/裂纹缺陷.mp3'

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
        status: ['检测合格','划痕缺陷',['压坑缺陷','裂纹缺陷'],'腐蚀缺陷','裂纹缺陷'],
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
        detecte: '0000'
      }
    }
  },
  created(){
    // this.playAudio()
  },
  mounted() {
    console.log('mounted');
    this.playAudio()
  },
  methods: {
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
      let audio = document.getElementById("audioId");
      if (this.form.detecte == '0000') {
        console.log("audio---------",audio);
        audio.src = qualified
        audio.play()
      }
      // if (this.result == '0000') {
      //   audio.src = qualified
      //   audio.play()
      // }
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
</style>

