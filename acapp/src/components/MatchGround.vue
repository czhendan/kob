<template>
    <div class="matchground-field">
        <div class="matchground">
            <div class="matchground-head">
                <div>
                    <div class="user-photo">
                        <img :src="$store.state.user.photo" alt="">
                    </div>
                    <div class="username">
                        {{$store.state.user.username}}
                    </div>
                </div>
                <div class="user-select-bot">
                    <select class="form-select" v-model="select_bot">
                        <option selected value="-1">亲自上阵</option>
                        <option v-for="bot in bots" :key="bot.id" :value="bot.id">
                            {{bot.title}}
                        </option>
                    </select>
                </div>
                <div>
                    <div class="user-photo">
                        <img :src="$store.state.pk.opponent_photo" alt="">
                    </div>
                    <div class="username">
                        {{$store.state.pk.opponent_username}}
                    </div>
                </div>
            </div>
            <div class="start-match-button">
                <button @click="click_match_btn" type="button">
                    {{match_btn_info}}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from 'vuex';
import $ from "jquery"

export default {
    setup() {
        const store = useStore();
        let match_btn_info = ref("开始匹配");
        let bots = ref([]);
        let select_bot = ref("-1");

        const click_match_btn = () => {
            if (match_btn_info.value === "开始匹配") {
                match_btn_info.value = "取消";
                store.state.pk.socket.send(JSON.stringify({
                    event: "start-matching",
                    bot_id: select_bot.value,
                }));
            }
            else {
                match_btn_info.value = "开始匹配";
                store.state.pk.socket.send(JSON.stringify({
                    event: "stop-matching",
                }));
            }
        };

        const refresh_bots = () => {
            $.ajax({
                url: "https://app7351.acapp.acwing.com.cn/api/user/bot/getlist/",
                type: "get",
                headers: {
                    Authorization: "Bearer " + store.state.user.token,
                },
                success(resp) {
                    bots.value = resp;
                },
            });
        };

        refresh_bots();

        return {
            match_btn_info,
            click_match_btn,
            bots,
            select_bot,
        };
    }
}
</script>

<style scoped>
div.matchground-field{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
}
div.matchground {
    display: flex;
    width: 60%;
    height: 60%;
    background-color: rgba(50, 50, 50, 0.5);
    flex-direction: column;
    justify-content: space-evenly;
}
div.matchground-head{
    display: flex;
    justify-content: space-around;
}
div.user-photo{
    text-align: center;
}
div.user-photo > img{
    border-radius: 50%;
    width: 10vh;
}
div.username{
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color:white;
    padding-top: 2vh;
}
div.user-select-bot{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15vw;
    text-align: center;
}
div.user-select-bot > select{
    margin: 0 auto;
    width: 10vw;
    font-size: 20px;
    border-radius: 5px;
    height: 4.5vh;
}
div.start-match-button{
    text-align: center; 
}
.start-match-button > button{
    font-size: 20px;
    border-radius: 5px;
    background-color: #FFC310;
    padding: 8px 12px;
    border: none;
    cursor: pointer;
}
</style>