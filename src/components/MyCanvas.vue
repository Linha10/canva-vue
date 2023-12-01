<template>
  <div class="test">
    <div class="actionsWrap">
      <!-- 簽名區 -->
      <div
        class="canvas-outer"
        :style="{ height: `${isMobile ? '204px' : '214px'}` }"
      >
        <!-- 簽名畫布 -->
        <canvas
          :class="['canvas-inner', { rotateCanvas: isMobile }]"
          ref="canvas"
          @mousedown="onCanvasMouseDown"
          @mouseup="onCanvasMouseUp"
          @touchstart="onCanvasMouseDown"
          @touchmove="touchmove"
        ></canvas>
      </div>
      <!-- 工具列 -->
      <div class="actions">
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
  </div>
</template>

<script>
import { isEmpty } from "lodash";
export default {
  name: "BpmSignature",
  props: {
    customOptions: {
      default: () => ({}),
      type: Object,
    },
    isMobile: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      canvas: null,
      // 畫布資料
      canvasContext: null,
      // 畫布背景色
      backgroundColor: "lightgoldenrodyellow",
      // 當前線條色
      currentPenColor: null,
      // 起始位置
      pointer: { x: 0, y: 0 },
      // 壓著滑鼠左鍵
      isCanvasMouseDown: false,
      // 畫布原點
      coordinateOrigin: { x: null, y: null },
      isDrawing: false,
    };
  },
  computed: {
    getCoordinateOrigin() {
      const canvasPosition = this.canvasContext.canvas.getBoundingClientRect();
      return { x: canvasPosition.x, y: canvasPosition.y };
    },
    // TODO 線條粗度
    currentSize() {
      return this.isMobile ? "1" : "3";
    },
    canvasOptions() {
      return {
        width: this.isMobile ? 309 : 734,
        height: this.isMobile ? 158 : 254,
        ...this.customOptions,
      };
    },
    getCanvasSize() {
      return {
        width: this.isMobile ? 309 : 734,
        height: this.isMobile ? 158 : 254,
      };
    },
  },
  mounted() {
    this.initCanvas();
  },
  methods: {
    /**
     * 重置canvas設定、綁定滑鼠監聽
     */
    initCanvas() {
      this.setCanvas();
      this.currentPenColor = "black";
      this.setWindowEvent();
    },
    /**
     * 建立canvas畫布
     */
    setCanvas() {
      const canvas = this.$refs.canvas || document.querySelector("canvas");
      // 寬高設定
      [canvas.width, canvas.height] = [
        this.canvasOptions.width,
        this.canvasOptions.height,
      ];

      const ctx = canvas.getContext("2d");
      // 圓形筆頭
      ctx.lineCap = "round";
      // 轉角連接圓化
      ctx.linJoin = "round";
      this.canvasContext = ctx;

      this.canvas = canvas;
    },
    /**
     * 監聽滑鼠移動事件
     */
    setWindowEvent() {
      window.addEventListener("mousemove", this.handleTrackingMouse);
    },

    /**
     * 取得滑鼠位置
     *
     * @param {object} event 事件
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
            this.pointer.x > this.canvasOptions.width ||
            this.pointer.x < 0 ||
            this.pointer.y > this.canvasOptions.height ||
            this.pointer.y < 0
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
     *
     * @param {object} event - 觸碰/點擊事件
     * @returns {object}
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
     *
     * @param {object} event 事件
     * @returns {object | void}
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
      canvasContext.lineWidth = this.currentSize * 1.5;
      action(canvasContext);
      canvasContext.stroke();
    },
    /**
     * 繪圖前執行動作
     *
     */
    beforeMove() {
      this.isDrawing = true;
      !this.isMobile ? this.onCanvasMouseDown() : this.touchmove();
    },
    /**
     * 點下滑鼠
     *
     */
    onCanvasMouseDown() {
      this.isCanvasMouseDown = true;
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
    clearAll() {
      let canvas = this.canvasContext.canvas;
      this.canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      this.isDrawing = false;
    },

    /**
     * 手指移動
     *
     * @param {object} event 點擊事件
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
     *
     * @returns {object}
     */
    getPngSignature() {
      const isBlank = this.isCanvasBlank(this.canvas);
      return isBlank ? "" : this.$refs.canvas.toDataURL("image/png");
    },
    /**
     * 確認當前畫布是否為空
     *
     * @param {Element} canvas 畫布
     * @returns {boolean}
     */
    isCanvasBlank(canvas) {
      const context = canvas.getContext("2d");

      const pixelBuffer = new Uint32Array(
        context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
      );

      // 如果u32返回為0 則為空白
      return !pixelBuffer.some((item) => item !== 0);
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
.rotateCanvas {
  transform: rotate(90deg);
  .actionsWrap {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .actions {
    margin-right: 10px;
    white-space: nowrap;
    transform: rotate(90deg);
  }
}
</style>
