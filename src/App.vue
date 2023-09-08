<template>
  <div class="signature">
    <!-- 開啟簽名設定彈窗 -->
    <el-button type="primary" @click="handleOuterDialogVisible" size="mini">
      設定簽名
    </el-button>

    <!-- 簽名設定彈窗 -->
    <el-dialog
      title="簽名設定"
      :visible.sync="outerDialogVisible"
      width="300px"
      center
    >
      <!-- 簽名設定彈窗 - 內容區塊 -->
      <div style="text-align: center">
        <!-- 簽名鈕  -->
        <el-button
          v-show="isSignatureImgEmpty"
          style="width: 100%"
          @click="openCanvasDialog"
        >
          簽名
        </el-button>
        <!-- 簽名圖檔標籤 -->
        <div>
          <el-tag
            v-show="!isSignatureImgEmpty"
            v-for="item in signatureImg"
            :key="item.src"
            closable
            @close="removeTag(item.src)"
            size="medium"
            style="height: 100%"
            class="signature__tag"
          >
            <!-- 圖檔 -->
            <el-image class="signature__tag__image" :src="item.src"></el-image>
          </el-tag>
        </div>

        <!-- 編輯我的簽名彈窗 -->
        <el-dialog
          class="signDialog"
          :visible.sync="dialogVisible"
          :width="isMobile ? '300px' : '580px'"
          center
          appendToBody
        >
          <!-- 彈窗標題 -->
          <template #title>
            <div class="signDialog__label">編輯我的簽名</div>
          </template>
          <!-- Canvas簽名 -->
          <template>
            <MyCanvas
              :width="canvasSetting.width"
              :height="canvasSetting.height"
              ref="signatureCanvas"
            />
          </template>
          <!-- footer按鈕 -->
          <div slot="footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="signatureConfirm">
              確 定
            </el-button>
          </div>
        </el-dialog>
      </div>
      <!-- 設定簽名彈窗footer -->
      <div slot="footer">
        <el-button type="primary" @click="handleOuterDialogVisible"
          >確定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MyCanvas from "@/components/MyCanvas";
import mobile from "is-mobile";
import { isEmpty } from "lodash";

export default {
  name: "SignatureDisplay",
  components: {
    MyCanvas,
  },
  data() {
    return {
      // 簽名設定彈窗狀態
      outerDialogVisible: false,
      // 編輯簽名彈窗狀態
      dialogVisible: false,
      // 簽名圖檔
      signatureImg: [],
      // 手機模式
      isMoible: false,
    };
  },
  created() {
    this.isMobile = mobile({ featureDetect: true, tablet: true });
  },
  computed: {
    /**
     * 儲存簽名圖檔陣列是否為空
     */
    isSignatureImgEmpty() {
      return isEmpty(this.signatureImg);
    },
    /**
     * 桌機 & 手機版 canvas畫布設定
     */
    canvasSetting() {
      return this.isMobile
        ? { width: 245, height: 200 }
        : { width: 525, height: 210 };
    },
  },
  methods: {
    /**
     * 關閉簽名設定彈窗
     */
    handleOuterDialogVisible() {
      this.outerDialogVisible = !this.outerDialogVisible;
    },
    /**
     * 開啟編輯簽名彈窗
     */
    openCanvasDialog() {
      this.dialogVisible = true;
      this.$refs.signatureCanvas?.initCanvas();
    },
    /**
     * 關閉 編輯我的簽名彈窗 & 取得簽名
     */
    signatureConfirm() {
      const signature = this.$refs.signatureCanvas.getSignature();
      this.signatureImg = [...this.signatureImg, signature];

      this.dialogVisible = false;
    },
    /**
     * 移除簽名
     *
     * @param {String} imgSrc 簽名圖檔資訊
     */
    removeTag(imgSrc) {
      this.signatureImg = this.signatureImg.filter(({ src }) => imgSrc !== src);
    },
  },
};
</script>

<style lang="scss" scoped>
.signature {
  display: flex;
}
:deep(.el-dialog__header) {
  height: 56px;
  padding: 0 24px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
}
.signDialog {
  .signDialog__label {
    font-weight: 700;
    font-size: 16px;
    color: black;
  }
  .signature__cancel {
    padding: 0 !important;
    border: 0 !important;
    border-radius: 4px;
    position: absolute;
  }
}

.signature__tag {
  padding-top: 10px;
  .signature__tag__image {
    width: 200px;
    height: 40px;
  }
}
:deep(.el-tag .el-icon-close) {
  top: -35px;
}
</style>
