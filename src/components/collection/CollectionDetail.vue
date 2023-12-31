<template>
    <div class="container">
        <header-cover>
            <div class="article-info">
                <h1 class="article-title">
                    <book-filled /> {{ route.query.collection }}--({{ data.total }}篇)
                </h1>
            </div>
        </header-cover>

        <div class="list">
            <div class="sort">
                <el-switch v-model="data.isSortByTimeDesc" class="mb-2"
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #49b1f5" active-text="时间顺序"
                    inactive-text="序号顺序">
                </el-switch>
                <div style="width: 20px;"></div>
                <el-switch v-model="data.isSortDesc" class="ml-2" inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #49b1f5" active-text="降序"
                    inactive-text="升序">
                </el-switch>
            </div>
            <a-list item-layout="vertical" size="large" v-for="item in data.listData" :key="item.id">
                <div class="card animate__animated animate__bounceIn" @click="toArticle(item.id)" v-if="item.id != 0">
                    <a-list-item key="item.title">
                        <template #actions>
                            <span class="content">
                                <CalendarOutlined /> {{ item.publishTime }}
                            </span>
                            <span class="content">
                                <EyeOutlined /> {{ item.viewsCount }}
                            </span>
                        </template>
                        <template #extra>
                            <img height="165" width="290" alt="logo" :src="item.imagePath" @error="imgError(item.id)"
                                v-if="!item.imgErr" />
                            <img height="165" width="290" alt="logo" src="/images/404.png" v-if="item.imgErr" />
                        </template>
                        <a-list-item-meta>
                            <template #title>
                                <span class="content">
                                    <router-link :to="{ path: '/article', query: { id: item.id } }">
                                        <span v-if="item.sortId">【{{ item.sortId }}】</span> 🔗 {{ item.title }}
                                    </router-link>
                                </span>
                                <div class="description-label">
                                    {{ item.description }}
                                </div>
                            </template>
                        </a-list-item-meta>
                        <span class="content">{{ item.content.replace(new RegExp('[#-|*"]', 'g'), "") }}</span>
                    </a-list-item>
                </div>

            </a-list>
        </div>
        <div class="page-compoment">
            <el-pagination background layout="prev, pager, next" :total="data.total" :page-size="data.pageSize"
                v-model:current-page="data.currentPage" hide-on-single-page="true" />
        </div>
    </div>
</template>

<script lang='ts' setup>
import { reactive, onMounted, watch } from 'vue';
import { CalendarOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router';
import router from '@/router';
import request from '@/api/request';
import { errTips } from '@/utils';
const route = useRoute();

const imgError = (id: number) => {
    for (let i = 0; i < data.listData.length; i++) {
        if (data.listData[i].id == id) {
            data.listData[i].imgErr = true;
        }
    }
}

const data = reactive({
    listData: [{
        id: 0,
        title: '',
        description: '',
        content: '',
        imagePath: '',
        viewsCount: 0,
        publishTime: '',
        imgErr: false,
        sortId: 0
    }],
    total: 0,
    pageSize: 5,
    currentPage: 1,
    isSortByTimeDesc: false,
    isSortDesc: false,
})

// 从后端请求分类的数据
const getBlogsByCategory = (page_size: number, current_page: number) => {
    request({
        method: "GET",
        url: '/blog/getBlogsByCollection',
        params: {
            pageSize: page_size,
            currentPage: current_page,
            collection: route.query.collection,
            isSortByTimeDesc: data.isSortByTimeDesc,
            isSortDesc: data.isSortDesc
        }
    }).then((resp) => {
        data.listData = resp.data;
    }).catch((err) => {
        errTips("获取信息失败!")
    })
}

// 获取指定分类的文章数量
const getBlogsCountByCategory = () => {
    request({
        method: "GET",
        url: '/blog/getCountByCollection',
        params: {
            collection: route.query.collection,
        }
    }).then((resp) => {
        data.total = resp.data
    }).catch((err) => {
        errTips("获取信息失败!")
    })
}

// 进入查看文章界面
const toArticle = (id: number) => {
    router.push({ name: 'article', query: { id: id } });
}

// 监听页码变化
watch(
    () => data.currentPage,
    (newVal, oldVal) => {
        getBlogsByCategory(data.pageSize, data.currentPage);
        // 回到顶部
        window.scroll(0, 0);
    }
)

// 监听排序变化
watch(
    ()=> data.isSortByTimeDesc,
    ()=>{
        getBlogsByCategory(data.pageSize, data.currentPage);
    }
)
watch(
    ()=> data.isSortDesc,
    ()=>{
        getBlogsByCategory(data.pageSize, data.currentPage);
    }
)

onMounted(() => {
    getBlogsByCategory(data.pageSize, data.currentPage);
    getBlogsCountByCategory();
    window.scroll(0, 0)
})
</script>

<style scoped lang='less'>
.sort {
    width: 100%;
    display: flex;
    justify-content: right;
}

:deep(.el-pagination.is-background .el-pager li) {
    background-color: var(--theme-background) !important; //修改默认的背景色
    color: var(--theme-font-color);
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
    background-color: var(--theme-category-btn-color) !important;
}

:deep(.el-pagination.is-background .btn-prev) {
    background-color: var(--theme-background);
    color: var(--theme-font-color);
}

:deep(.el-pagination.is-background .btn-next) {
    background-color: var(--theme-background);
    color: var(--theme-font-color);
}

img {
    margin-left: -15px;
}

.page-compoment {
    width: 100%;
    justify-content: center;
    display: flex;
}

.description-label {
    color: var(--theme-font-color);
    font-weight: 500;
    font-style: italic;
    font-size: 0.9em;
    margin-top: 10px;
}

.content {
    color: var(--theme-font-color);
    overflow: hidden;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    margin-top: -10px;
}

.container {
    background-color: var(--theme-background);
    overflow-x: hidden;
}

.list {
    padding: 5% 10%;
    min-height: 500px;
}

.card {
    background-color: var(--theme-card-color);
    margin-top: 20px;
    border: dashed rgb(198, 198, 198);
}

.card:hover {
    background-color: rgb(137, 137, 137);
}

.card:active {
    background-color: rgb(196, 196, 196);
}
</style>