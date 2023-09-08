<template>
  <div>
    <!-- 簽名區 -->
    <div
      class="canvas-outer"
      :style="{ height: `${isMobile ? '204px' : '214px'}` }"
    >
      <!-- 簽名畫布 -->
      <canvas
        class="canvas-inner"
        ref="canvas"
        @mousedown="onCanvasMouseDown"
        @mouseup="onCanvasMouseUp"
        @touchstart="onCanvasMouseDown"
        @touchmove="touchmove"
      ></canvas>
    </div>
    <!-- 工具列 -->
    <div class="toolBox">
      <!-- 重置畫布鈕 -->
      <el-tooltip effect="dark" content="重新簽名" placement="top">
        <el-button
          type="danger"
          icon="el-icon-refresh"
          circle
          @click="resetCanvas"
          size="mini"
        ></el-button>
      </el-tooltip>
      <!-- 線條顏色工具 -->
      <div>
        <el-tooltip
          effect="dark"
          content="線條顏色"
          placement="top"
          v-if="!isMobile"
        >
          <el-radio-group
            v-model="currentPenColor"
            size="mini"
            :fill="`${currentPenColor}`"
          >
            <!-- 顏色選擇鈕 -->
            <el-radio-button
              v-for="item in penColors"
              :key="item.color"
              :label="item.color"
              :style="{ color: item.color }"
              >{{ item.name }}</el-radio-button
            >
          </el-radio-group>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import mobile from "is-mobile";
import { isEmpty } from "lodash";
export default {
  props: {
    // 畫布寬度
    width: {
      default: 300,
      type: [Number, String],
    },
    // 畫布高度
    height: {
      default: 200,
      type: Number,
    },
  },
  data() {
    return {
      // 是否為行動裝置
      isMobile: false,
      // 畫布資料
      canvasContext: null,
      // 畫布背景色
      backgroundColor: "lightgoldenrodyellow",
      // 當前線條色
      currentPenColor: null,
      // 線條顏色列表
      penColors: [
        { name: "Black", color: "black" },
        { name: "Lightgreen", color: "#9BFFCD" },
        { name: "Bpm-purple", color: "#822FEB" },
        { name: "Red", color: "red" },
      ],
      // 起始位置
      pointer: { x: 0, y: 0 },
      // 壓著滑鼠左鍵
      isCanvasMouseDown: false,
      // 畫布原點
      coordinateOrigin: { x: null, y: null },
    };
  },
  created() {
    this.isMobile = mobile({ featureDetect: true, tablet: true });
  },
  mounted() {
    this.initCanvas();
  },
  computed: {
    getCoordinateOrigin() {
      const canvasPosition = this.canvasContext.canvas.getBoundingClientRect();
      return { x: canvasPosition.x, y: canvasPosition.y };
    },
    // 線條粗度
    currentSize() {
      return this.isMobile ? "1" : "3";
    },
  },
  methods: {
    /**
     * 重置canvas設定、綁定滑鼠監聽
     */
    initCanvas() {
      this.setCanvas();
      this.currentPenColor = this.penColors[0].color;
      this.setWindowEvent();
    },
    /**
     * 建立canvas畫布
     */
    setCanvas() {
      const canvas = this.$refs.canvas;
      // 寬高隨意
      [canvas.width, canvas.height] = [this.width, this.height];
      const ctx = canvas.getContext("2d");
      // 圓形筆頭
      ctx.lineCap = "round";
      // 轉角連接圓化
      ctx.linJoin = "round";
      this.canvasContext = ctx;
    },
    /**
     * 監聽滑鼠移動事件
     */
    setWindowEvent() {
      window.addEventListener("mousemove", this.handleTrackingMouse);
    },

    /**
     * 取得滑鼠位置
     */
    handleTrackingMouse(event) {
      let currentPosition = this.getAbsolutePosition(event);

      // 滑鼠點壓下左鍵 && 滑鼠位置於視窗中
      if (this.isCanvasMouseDown && this.pointer) {
        this.draw((ctx) => {
          ctx.strokeStyle = this.currentPenColor;
          // 起始位置
          ctx.moveTo(this.pointer.x, this.pointer.y);
          // 停止位置
          ctx.lineTo(currentPosition.x, currentPosition.y);

          // 超出畫布時 停止動作
          if (
            this.pointer.x > this.width ||
            this.pointer.x < 0 ||
            this.pointer.y > this.height ||
            this.pointer < 0
          )
            this.onCanvasMouseUp();
        });
      }

      // 讀取滑鼠位置
      this.pointer = currentPosition;
    },

    /**
     * 移除滑鼠移動監聽事件
     */
    removeEventListener() {
      window.removeEventListener("mousemove", this.handleTrackingMouse);
    },

    /**
     * 已畫布左上角為(0, 0),取得當前指標相對畫布座標
     * @param {object} event - 觸碰/點擊事件
     *
     * @returns {Object}
     */
    getAbsolutePosition(event) {
      // 取得畫布起始座標
      const canvasPosition = this.canvasContext.canvas.getBoundingClientRect();
      this.coordinateOrigin = { x: canvasPosition.x, y: canvasPosition.y };

      // 畫布起使座標歸0
      const [x, y] = [
        event.clientX - canvasPosition.x,
        event.clientY - canvasPosition.y,
      ];

      return { x, y };
    },

    /**
     * 取得手指位置
     */
    getTouchPosition(event) {
      if (!isEmpty(event.targetTouches) && this.isMobile) {
        const touchEvent = event.targetTouches[0];
        return this.getAbsolutePosition(touchEvent);
      }
    },

    /**
     * 封裝作畫方法
     *
     * @param {Function} action 函式
     */
    draw(action) {
      let canvasContext = this.canvasContext;
      canvasContext.beginPath();
      canvasContext.lineWidth = this.currentSize * 2;
      action(canvasContext);
      canvasContext.stroke();
    },

    /**
     * 點下滑鼠
     */
    onCanvasMouseDown() {
      if (this.isMobile) {
        let startPoint = this.getTouchPosition(event);
        this.lastPtr = { x: startPoint?.x, y: startPoint?.y };
        this.canvasContext.moveTo(startPoint?.x, startPoint?.y);
      } else {
        this.isCanvasMouseDown = true;
      }
    },

    /**
     * 結束滑鼠左鍵點擊狀態
     */
    onCanvasMouseUp() {
      this.isCanvasMouseDown = false;
    },

    /**
     * 重置畫布
     */
    resetCanvas() {
      let canvas = this.canvasContext.canvas;
      this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    },

    /**
     * 手指移動
     */
    touchmove(event) {
      const nextPosition = this.getTouchPosition(event);

      this.draw((ctx) => {
        // 未正確取得座標
        if (!nextPosition) return;

        ctx.strokeStyle = this.currentPenColor;
        ctx.moveTo(this.lastPtr.x, this.lastPtr.y);
        // 停止位置
        ctx.lineTo(nextPosition.x, nextPosition.y);
        // 更新指標位置
        this.lastPtr = { x: nextPosition.x, y: nextPosition.y };
      });
    },

    /**
     * 取得簽名圖檔
     */
    getSignature() {
      const signatureImg = this.$refs.canvas.toDataURL("image/png");
      this.resetCanvas();
      this.removeEventListener();
      return { src: signatureImg };
    },
  },
};
</script>

<style lang="scss">
.canvas-outer {
  background: rgb(245, 245, 245);
  border-radius: 4px;

  .canvas-inner {
    border: 2px solid rgb(229, 229, 229);
    border-radius: 4px;
    cursor: crosshair;
    background-color: transparent;
  }
}

.toolBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>
