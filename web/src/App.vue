<template>
  <div>bot昵称: {{ bot_name }}</div>
  <router-view />
</template>

<script>
import $ from 'jquery';
import { ref } from 'vue';

export default {
    name: "App",
    setup: () => {
        let bot_name = ref("");

        $.ajax({
            url: "http://localhost:3000/pk/getbotinfo/",
            type: "get",
            success: resp => {
                bot_name.value = resp[0];
            },
        });

        return {
            bot_name,
        };
    },
};
</script>

<style>
body {
    background-image: url("@/assets/background.png");
    background-size: cover;
}
</style>
