<template>
  <div
    style="
      background-color: rgba(255, 125, 0, 0.08);
      height: 130px;
      border-radius: 8px;
      margin-bottom: 20px;
    "
  >
    <p
      style="
        font-size: 26px;
        font-family: Arial, serif;
        font-weight: bold;
        line-height: 90px;
        padding-left: 30px;
        vertical-align: center;
      "
    >
      {{ name }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: ['name']
};
</script>

<style scoped></style>
