<template>
  <div class="page">
    <view class="flex flex-col line-after z-999">
      <AppNavBar title="" :isBack="true" :border="false" backgroundColor="#f5f5f5">
        <template #left>
          <CurrentChatObject />
        </template>
      </AppNavBar>
      <view class="h-48 px-12 flex items-center justify-between">
        <u-search
          placeholder="搜索"
          :focus="false"
          :animation="false"
          @search="onSearch"
          @custom="onSearch"
          v-model="query.keyword"
        ></u-search>
      </view>
    </view>

    <z-paging
      ref="pagingRef"
      class="z-paging mt-48"
      :use-virtual-list="true"
      v-model="dataList"
      @query="queryList"
      @refresh="onRefresh"
      :auto="true"
      :default-page-size="query.maxResultCount!"
    >
      <template #empty>没有数据哦</template>

      <template #loading>
        <SessionUnitSkeleton :count="11" />
      </template>

      <template #loadingMoreLoading>
        <SessionUnitSkeleton :count="1" />
      </template>

      <template #loadingMoreNoMore>
        <view style="background-color: red;">没有了</view>
      </template>

      <!-- <div
        v-if="isPending && dataList.length == 0"
        class="flex flex-center text-gray-400 w-full h-full absolute text-12"
      >
        加载中...
      </div> -->

      <template #cell="{ item, index }">
        <SessionUnit :item="item" :index="index" />
      </template>


    </z-paging>
  </div>
</template>

<script lang="ts" setup>
import { usePaging } from '@/hooks/usePaging';
import { useUser } from '@/store/user';
import { useAuth } from '@/store/auth';
import { getSessionUnitList } from '@/api/chatApi';
import CurrentChatObject from './components/CurrentChatObject.vue';
import SessionUnit from './components/SessionUnit.vue';
import SessionUnitSkeleton from './components/SessionUnitSkeleton.vue';

const userStore = useUser();
const authStore = useAuth();

const onRefresh = () => {
  uni.$emit('refresh@chat-index');
  console.log('刷新');
};

const { pagingRef, dataList, queryList, isPending, query, reload } =
  usePaging<ChatApi.SessionUnitListInput>({
    input: {
      ownerId: 13,
      maxResultCount: 40,
    },
    service: getSessionUnitList,
  });

const onSearch = () => {
  console.log('搜索关键字:', query.value.keyword);
};

onMounted(() => {
  // 页面加载时可以执行一些初始化操作
  console.log('Message page mounted');
});
</script>

<style lang="scss" scoped></style>
