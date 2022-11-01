<template>
  <div class="flexed columned">
    <stat-item size="medium" text="Accuracy"         :value="accuracyCalc"    units="%"  :reversed="reversed"/>
    <stat-item size="medium" text="Missed shots"     :value="personStat.missedShots"     :reversed="reversed"/>
    <stat-item size="medium" text="Successful shots" :value="personStat.successfulShots" :reversed="reversed"/>
    <stat-item size="medium" text="Total shots"      :value="personStat.totalShots"      :reversed="reversed"/>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  import StatItem from "@/frontend/pages/game/components/StatItem.vue";

  export default defineComponent({
    name: "StatItems",
    components: {StatItem},

    props: {
      personStat: { type: Object,  required: true  },
      reversed:   { type: Boolean, required: false },
    },

    methods: {
      accuracyCounter() {
        const {successfulShots : x, totalShots: y} = this.personStat;
        return Math.round(x / y * 100 || 0);
      },
    },
    computed: {
      accuracyCalc:   function () { return this.accuracyCounter()   },
    }

  })
</script>

<style scoped lang="less">

  .flexed {
    display: flex;
  }
  .columned {
    flex-direction: column;
  }

</style>