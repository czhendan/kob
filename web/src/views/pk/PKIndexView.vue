<template> 
    <PlayGround v-if="$store.state.pk.status === 'playing' || $store.state.pk.status === 'paused'" />
    <MatchGround v-if="$store.state.pk.status === 'matching'" />
    <ResultBoard v-if="$store.state.pk.loser !== 'none'" />
    <div class="user-color" v-if="($store.state.pk.status === 'playing' || $store.state.pk.status === 'paused') && parseInt($store.state.user.id) === parseInt($store.state.pk.a_id)">左下角</div>
    <div class="user-color" v-if="($store.state.pk.status === 'playing' || $store.state.pk.status === 'paused') && parseInt($store.state.user.id) === parseInt($store.state.pk.b_id)">右上角</div>
    <div v-if="$store.state.pk.status === 'paused'" class="pause-overlay">
        <div class="pause-text">已暂停，等待重连</div>
        <div v-if="$store.state.pk.pause_countdown > 0" class="pause-countdown">即将恢复：{{$store.state.pk.pause_countdown}}s</div>
    </div>
</template>

<script>
import PlayGround from "@/components/PlayGround.vue";
import MatchGround from "@/components/MatchGround.vue";
import ResultBoard from '@/components/ResultBoard.vue'
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
    components: {
        PlayGround,
        MatchGround,
        ResultBoard,
    },
    setup() {
        const store = useStore();
        const socket_url = `wss://app7358.acapp.acwing.com.cn/websocket/${store.state.user.token}/`;

        let socket = null;
        let reconnecting = false;
        let countdownTimer = null;

        const clearCountdownTimer = () => {
            if (countdownTimer) {
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
        };

        const startCountdown = (seconds) => {
            store.commit("updatePauseCountdown", seconds);
            clearCountdownTimer();
            countdownTimer = setInterval(() => {
                const next = store.state.pk.pause_countdown - 1;
                store.commit("updatePauseCountdown", next);
                if (next <= 0) {
                    clearCountdownTimer();
                }
            }, 1000);
        };

        const connect = () => {
            socket = new WebSocket(socket_url);

            socket.onopen = () => {
                console.log("connected!");
                store.commit("updateSocket", socket);
                reconnecting = false;
                if (store.state.pk.game_id) {
                    socket.send(JSON.stringify({
                        event: "reconnect",
                        game_id: store.state.pk.game_id,
                    }));
                }
            };

            socket.onmessage = msg => {
                const data = JSON.parse(msg.data);
                if (data.event === "start-matching") { // 匹配成功
                    store.commit("updateOpponent", {
                        username: data.opponent_username,
                        photo: data.opponent_photo,
                    });
                    store.commit("updatePauseCountdown", 0);
                    setTimeout(() => {
                        store.commit("updateStatus", "playing")
                    }, 1000);
                    store.commit("updateGame", data.game);
                }
                else if (data.event === "move") {
                    const gameObject = store.state.pk.gameObject;
                    const [snake0, snake1] = gameObject.snakes;
                    snake0.set_direction(data.a_direction);
                    snake1.set_direction(data.b_direction);
                }
                else if (data.event === "result") {
                    console.log(data);
                    const gameObject = store.state.pk.gameObject;
                    const [snake0, snake1] = gameObject.snakes;

                    if (data.loser === "all" || data.loser === "A") {
                        snake0.status = "die";
                    }
                    if (data.loser === "all" || data.loser === "B") {
                        snake1.status = "die";
                    }
                    store.commit("updateLoser", data.loser);
                }
                else if (data.event === "pause") {
                    store.commit("updateStatus", "paused");
                    store.commit("updatePauseCountdown", 0);
                }
                else if (data.event === "resume-countdown") {
                    store.commit("updateStatus", "paused");
                    startCountdown(data.seconds || 3);
                }
                else if (data.event === "resume") {
                    clearCountdownTimer();
                    store.commit("updatePauseCountdown", 0);
                    store.commit("updateStatus", "playing");
                }
            };

            socket.onclose = () => {
                console.log("disconnected!");
                if ((store.state.pk.status === "playing" || store.state.pk.status === "paused") && store.state.pk.loser === "none") {
                    store.commit("updateStatus", "paused");
                    if (!reconnecting) {
                        reconnecting = true;
                        setTimeout(() => connect(), 500);
                    }
                }
            };
        };

        onMounted(() => {
            store.commit("updateOpponent", {
                username: "我的对手",
                photo: "https://cdn.acwing.com/media/article/image/2022/08/09/1_1db2488f17-anonymous.png",
            })
            store.commit("updateLoser", "none");
            store.commit("updateIsRecord", false);
            connect();
        });

        onUnmounted(() => {
            socket.close();
            clearCountdownTimer();
        });
    },
}
</script>

<style scoped>
div.user-color{
    text-align: center;
    color: white;
    font-size: 30px;
    font-weight: 600;
}
div.pause-overlay{
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 28px;
    font-weight: 700;
    background-color: rgba(0,0,0,0.45);
    z-index: 10;
}
div.pause-countdown{
    margin-top: 12px;
    font-size: 22px;
    font-weight: 600;
}
</style>
