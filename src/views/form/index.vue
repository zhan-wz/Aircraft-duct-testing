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
          placeholder="请输入内容"
          @select="handleSelect"
          style="width: 400px; margin-right: 100px;"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item >
        <el-button type="primary" @click="onSubmit">开始检测</el-button>
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
        total: 1, //检测工件数
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
      total: 0,
      audio: 1,
      flag: false, // 有缺陷为TRUE
      time: ''
    }
  },
  created(){
    this.fetchData()
    this.fetchTotal()
  },
  mounted() {
    console.log('mounted');
    // 拿到图号的数据
    this.restaurants = this.loadAll();
    // 消息弹窗
    // do 从store中取值 
    if (this.formInline.name == '') {
      this.$prompt('请输入令号', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '令号格式不正确'
      }).then(({ value }) => {
        // do 将value存在store中   if 判断store是否有值 消息弹窗弹出
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
    // 获取最新一次检测任务
    fetchData() {
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
        // 语音播报
        this.playAudio()
      })
    },
    // 图号数据
    loadAll() {
      return [
        { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
        { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
        { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
        { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
        { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
        { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
        { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
        { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
        { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
        { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" },
        { "value": "新麦甜四季甜品炸鸡", "address": "嘉定区曹安公路2383弄55号" },
        { "value": "Monica摩托主题咖啡店", "address": "嘉定区江桥镇曹安公路2409号1F，2383弄62号1F" },
        { "value": "浮生若茶（凌空soho店）", "address": "上海长宁区金钟路968号9号楼地下一层" },
        { "value": "NONO JUICE  鲜榨果汁", "address": "上海市长宁区天山西路119号" },
        { "value": "CoCo都可(北新泾店）", "address": "上海市长宁区仙霞西路" },
        { "value": "快乐柠檬（神州智慧店）", "address": "上海市长宁区天山西路567号1层R117号店铺" },
        { "value": "Merci Paul cafe", "address": "上海市普陀区光复西路丹巴路28弄6号楼819" },
        { "value": "猫山王（西郊百联店）", "address": "上海市长宁区仙霞西路88号第一层G05-F01-1-306" },
        { "value": "枪会山", "address": "上海市普陀区棕榈路" },
        { "value": "纵食", "address": "元丰天山花园(东门) 双流路267号" },
        { "value": "钱记", "address": "上海市长宁区天山西路" },
        { "value": "壹杯加", "address": "上海市长宁区通协路" },
        { "value": "唦哇嘀咖", "address": "上海市长宁区新泾镇金钟路999号2幢（B幢）第01层第1-02A单元" },
        { "value": "爱茜茜里(西郊百联)", "address": "长宁区仙霞西路88号1305室" },
        { "value": "爱茜茜里(近铁广场)", "address": "上海市普陀区真北路818号近铁城市广场北区地下二楼N-B2-O2-C商铺" },
        { "value": "鲜果榨汁（金沙江路和美广店）", "address": "普陀区金沙江路2239号金沙和美广场B1-10-6" },
        { "value": "开心丽果（缤谷店）", "address": "上海市长宁区威宁路天山路341号" },
        { "value": "超级鸡车（丰庄路店）", "address": "上海市嘉定区丰庄路240号" },
        { "value": "妙生活果园（北新泾店）", "address": "长宁区新渔路144号" },
        { "value": "香宜度麻辣香锅", "address": "长宁区淞虹路148号" },
        { "value": "凡仔汉堡（老真北路店）", "address": "上海市普陀区老真北路160号" },
        { "value": "港式小铺", "address": "上海市长宁区金钟路968号15楼15-105室" },
        { "value": "蜀香源麻辣香锅（剑河路店）", "address": "剑河路443-1" },
        { "value": "北京饺子馆", "address": "长宁区北新泾街道天山西路490-1号" },
        { "value": "饭典*新简餐（凌空SOHO店）", "address": "上海市长宁区金钟路968号9号楼地下一层9-83室" },
        { "value": "焦耳·川式快餐（金钟路店）", "address": "上海市金钟路633号地下一层甲部" },
        { "value": "动力鸡车", "address": "长宁区仙霞西路299弄3号101B" },
        { "value": "浏阳蒸菜", "address": "天山西路430号" },
        { "value": "四海游龙（天山西路店）", "address": "上海市长宁区天山西路" },
        { "value": "樱花食堂（凌空店）", "address": "上海市长宁区金钟路968号15楼15-105室" },
        { "value": "壹分米客家传统调制米粉(天山店)", "address": "天山西路428号" },
        { "value": "福荣祥烧腊（平溪路店）", "address": "上海市长宁区协和路福泉路255弄57-73号" },
        { "value": "速记黄焖鸡米饭", "address": "上海市长宁区北新泾街道金钟路180号1层01号摊位" },
        { "value": "红辣椒麻辣烫", "address": "上海市长宁区天山西路492号" },
        { "value": "(小杨生煎)西郊百联餐厅", "address": "长宁区仙霞西路88号百联2楼" },
        { "value": "阳阳麻辣烫", "address": "天山西路389号" },
        { "value": "南拳妈妈龙虾盖浇饭", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
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
          if(response.status == 200){
            // 图号 令号 发送成功
            // 检测前 先清空上一次的form数据
            this.form.defectType = []
            this.form.oriImg = []
            this.form.markImg = []
            this.form.detecte = ''
            // 开始检测 获取最新一次的检测数据
            setTimeout(() => {
              this.fetchData()
              this.fetchTotal() // 得到result 检测结果计数
            },3000) 
            this.total++
            // 监听最新检测任务  不需要了
            /**
             * this.time = setInterval(() => {
              getID().then(response => {
                let data = response.data
                if(data.id !== this.total) {
                  this.form.total++
                  this.total = data.id
                }
              })
            },1000);
            */
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

