import Vue from "vue";
import VueRouter from "vue-router";
import quiz from "../components/quiz.vue";
import endScreen from "../components/endScreen.vue"
import startScreen from "../components/startScreen.vue"

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "startScreen",
        component: startScreen
    },
    {
        path: "/",
        name: "quiz",
        component: quiz,
    },
    {
        path: "/",
        name: "endScreen",
        component: endScreen,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
