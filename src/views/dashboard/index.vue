<template>
  <div class="app-container">
    <audio id="audioId" autoplay ></audio>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="3">原始采样图片：</el-col>
      <el-col :span="4" v-for="(o, index) in 5" :key="o" :offset=0.5>
        <el-card :body-style="{ padding: '0px' }">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <!-- <div style="padding: 14px;">
            <span>好吃的汉堡</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text" class="button">操作按钮</el-button>
            </div>
          </div> -->
        </el-card>
      </el-col>
    </el-row>
      
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="3">检测输出图片：</el-col>
      <el-col :span="4" v-for="(o, index) in 5" :key="o" :offset=0.3>
        <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="4">检测结果：</el-col>
      <el-col :span="4">检测合格</el-col>
      <el-col :span="4">划痕缺陷</el-col>
      <el-col :span="4">压坑缺陷</el-col>
      <el-col :span="4">腐蚀缺陷</el-col>
      <el-col :span="4">裂纹缺陷</el-col>
    </el-row>

    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="4">本次检测计数: </el-col>
      <el-col :span="4">检测合格: 5次</el-col>
      <el-col :span="4">划痕缺陷: 5次</el-col>
      <el-col :span="4">压坑缺陷: 5次</el-col>
      <el-col :span="4">腐蚀缺陷: 5次</el-col>
      <el-col :span="4">裂纹缺陷: 5次</el-col>
    </el-row>

    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="4">检测结果：</el-col>
      <el-col :span="20">{{ result }}</el-col>
      <!-- <el-col :span="4"><el-button type="primary" @click="playAudio">播放</el-button></el-col> -->
    </el-row>
    
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <!-- <div class="dashboard-text">原始采样图片：</div>
    <div class="dashboard-text">检测输出图片：</div>
    <div class="dashboard-text">检测结果分类：</div>
    <div class="dashboard-text">本次检测结果计数：</div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 音频文件引入 直接在js中audio.src=路径 会报错
import qualified from '../../../static/audio/检测合格.mp3'
import scratch from '../../../static/audio/划痕缺陷.mp3'
import pit from '../../../static/audio/压坑缺陷.mp3'
import corrosion from '../../../static/audio/腐蚀缺陷.mp3'
import crack from '../../../static/audio/裂纹缺陷.mp3'


export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      currentDate: new Date(),
      result: '0000'
    }
  },
  methods: {
    /** 
     * 音频特定条件下播放
    playAudio() {
      let audio = document.getElementById("audioId");
      if (检测合格) {
        audio.src = qualified
        audio.play()
      }
    }
    */
  }
}
</script>

<style lang="scss" scoped>
// .dashboard {
//   &-container {
//     margin: 30px;
//   }
//   &-text {
//     font-size: 30px;
//     line-height: 46px;
//   }
// }
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .image {
    width: 100%;
    display: block;
  }

  
</style>
