<template>
  <el-dialog
    class="signDialog"
    :visible.sync="dialogVisible"
    width="580px"
    :show-close="false"
    center
  >
    <template #title>
      <div class="signDialog__label">編輯我的簽名</div>
    </template>
    <template>
      <MyCanvas :width="525" :height="210" />
    </template>
    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">
        確 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script></script>
