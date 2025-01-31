<template>
    <!-- <div class="window"> -->
        <div class="game-body">
            <MenuView v-if="$store.state.router.router_name === 'menu'"/>
            <PKIndexView v-else-if="$store.state.router.router_name === 'pk'"/>
            <RecordIndexView v-else-if="$store.state.router.router_name === 'record'"/>
            <RecordContentView v-else-if="$store.state.router.router_name === 'record_content'"/>
            <RankListIndexView v-else-if="$store.state.router.router_name === 'ranklist'"/>
            <UserBotIndexView v-else-if="$store.state.router.router_name === 'user_bot'"/>
            <router-view></router-view>
        </div>
    <!-- </div> -->
</template>

<script>
import { useStore } from 'vuex';
import MenuView from '@/views/MenuView.vue';
import PKIndexView from '@/views/pk/PKIndexView.vue';
import RecordIndexView from '@/views/record/RecordIndexView.vue';
import RecordContentView from '@/views/record/RecordContentView.vue';
import RankListIndexView from '@/views/ranklist/RankListIndexView.vue';
import UserBotIndexView from '@/views/user/bot/UserBotIndexView.vue';

export default {
    components: {
        MenuView,
        PKIndexView,
        RecordContentView,
        RecordIndexView,
        RankListIndexView,
        UserBotIndexView,
    },
    setup() {
        const store = useStore();
        const jwt_token = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzNDFiNzliNmZlN2I0NWRlYjdkMTk1ZWJiZjM2MTJhYSIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTczODI5Mjg3NiwiZXhwIjoxNzM5NTAyNDc2fQ.wd81mq5WRDbzPE1gWX7klJS_N1hIrodvtko9cCG2EKs"
        if (jwt_token) {
            store.commit("updateToken", jwt_token);
            store.dispatch("getinfo", {
                success() {
                    store.commit("updatePullingInfo", false);
                },
                error() {
                    store.commit("updatePullingInfo", false);
                },
            })
        }
        else {
            store.commit("updatePullingInfo", false);
        }
    }
};
</script>

<style scoped>
body{
    margin: 0;
}
div.game-body {
    background-image: url("@/assets/images/background.png");
    background-size: cover;
    width: 100%;
    height: 100%;
}
div.window{
    width: 100vw;
    height: 100vh;
}
</style>
