<template>
  <div class="ship-stats">
    <h3 class="title">{{ shipType }}</h3>

    <div v-for="(ship, i) in shipArr" :key="i" class="flexed justifyed base-font">
      <span class="span-prettier on-duty" v-if="ship.some(el => el.alive)">On duty</span>
      <span class="span-prettier poseidoned" v-else>Sunked</span>
      <span class="span-counter">{{ finalDamage(ship, i) }} </span>
    </div>

  </div>
</template>

<script lang="ts">

  import { defineComponent } from 'vue';
  import { mapGetters } from "vuex";
  import {ShipOwner_Type, Ships_Types, ShipState_Type} from "@/store/battleShipModule";


  interface CompState_Type  {
    shipArr:    ShipState_Type[],
    shipsOwner: ShipOwner_Type,
    shipType:   Ships_Types,
    damageCalc: (shipData: { shipsOwner: ShipOwner_Type, shipType: Ships_Types, i: number }) => number
  }

  export default defineComponent({

    name: "ShipStatuses",

    props: {
      shipArr:    {type: Object, required: true},
      shipsOwner: {type: String, required: true},
      shipType:   {type: String, required: true},
    },

    computed: {
      ...mapGetters({
        damageCalc: 'ships/damageCalc',
      }),

      finalDamage: (state: CompState_Type) => (ship: ShipState_Type[], i: number) => {
        const shipData = {shipsOwner: state.shipsOwner, shipType: state.shipType, i};
        return 100 - Math.round(state.damageCalc(shipData) / ship.length * 100)
      }
    },

  })
</script>

<style scoped lang="less">

  @baseFontSize: 20px;
  @smallFontSize: 15px;
  @largeFontSize: 25px;

  .base-font {
    font-size: @baseFontSize;
  }
  .small-font {
    font-size:  @smallFontSize;
  }

  .ship-stats {
    min-width: 120px;
    /*outline: 2px solid red;*/
  }

  .title {
    text-transform: capitalize;
    text-align: center;
  }

  .span-prettier {
    height: 25px;
    margin: 2px 0;
    min-width: 100px;
    text-align: center;
    border-radius: 3px;
  }

  .span-counter {
    width: 50px;
    text-align: center;
    height: 25px;
    margin: 2px 0;
  }

  .on-duty {
    background: lightgreen;
  }

  .poseidoned {
    background: firebrick;
  }

  .flexed {
    display: flex;
  }

  .justifyed {
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .centred {
    justify-content: space-evenly;
    align-items: center;
  }

  .columned {
    flex-direction: column;
  }

</style>