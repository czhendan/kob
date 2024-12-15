<template>
    <NavBar />
    <router-view></router-view>
</template>

<script>
import NavBar from './components/NavBar.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
// import $ from 'jquery';

export default {
    components: {
        NavBar,
    },
    // setup() {
    //     $.ajax({
    //         url: "http://127.0.0.1:3000/user/account/token/",
    //         type: "post",
    //         data: {
    //             username: 'czd',
    //             password: 'pczd',
    //         },
    //         success(resp) {
    //             console.log(resp);
    //         },
    //         error(resp) {
    //             console.log(resp);
    //         },
    //     });

    //     $.ajax({
    //         url: "http://127.0.0.1:3000/user/account/info/",
    //         type: "get",
    //         headers: {
    //             Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhMTdmMmJkNDhiYTI0OGIzYTEwMTM5MzM2NTE1MjM0NyIsInN1YiI6IjEiLCJpc3MiOiJzZyIsImlhdCI6MTczNDIzMzU4MywiZXhwIjoxNzM1NDQzMTgzfQ.qXq6I2Q_7X8B_C3v-ut-_ChuxJ6E7uoOoVEknr5cVRU"
    //         },
    //         success(resp) {
    //             console.log(resp);
    //         },
    //         error(resp) {
    //             console.log(resp);
    //         },
    //     });

    //     $.ajax({
    //         url: "http://127.0.0.1:3000/user/account/register/",
    //         type: "post",
    //         data: {
    //             username: 'czd2',
    //             password: 'pczd2',
    //             confirmedPassword: 'pczd2',
    //         },
    //         success(resp) {
    //             console.log(resp);
    //         },
    //         error(resp) {
    //             console.log(resp);
    //         },
    //     });
    // },
};
</script>

<style>
body {
    background-image: url("@/assets/images/background.png");
    background-size: cover;
}
</style>
