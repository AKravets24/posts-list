import { createStore } from 'vuex'
import { postModule } from "@/store/postModule";
import {battleShipModule} from "@/store/battleShipModule";

export default createStore({
  modules: {
    post: postModule,
    ships: battleShipModule,
  }
})
