<template>
  <z-paging
    ref="pagingRef"
    v-model="dataList"
    @query="queryList"
    :auto="true"
    :use-virtual-list="true"
    :default-page-size="query.maxResultCount!"
  >
    <template #top>
      <AppNavBar :title="title" :isBack="true" :isMore="false" :border="true"></AppNavBar>
    </template>

    <template #loading>
      <SessionUnitSkeleton :count="10" />
      <div class="flex flex-center text-gray-400 w-full top-360 fixed text-12">加载中...</div>
    </template>

    <template #loadingMoreLoading>
      <SessionUnitSkeleton :count="3" text="加载中..." />
    </template>
    <template #loadingMoreDefault>
      <SessionUnitSkeleton :count="1" @click="loadingMoreClick" text="加载更多..." />
    </template>

    <template #loadingMoreNoMore>
      <Divider class="my-20" :text="`共有 ${totalCount} 人`" />
      <!-- <view class="flex flex-center h-48 text-12 text-gray-500">没有了</view> -->
    </template>

    <!--  -->

    <template #cell="{ item, index }">
      <!-- <div class="max-w-[25%]"> -->
      <ChatObject
        class="px-12 py-6"
        :size="48"
        :item="item.owner"
        :index="index"
        :active="true"
        @click="showMemberPop(item)"
        :arrow="true"
      >
        <template #title-right></template>
        <template #desc>
          <div class="flex">
            <span class="text-ellipsis text-gray text-12">
              加入时间:
              <Date :value="item.creationTime" empty="-"></Date>
            </span>
          </div>
        </template>
      </ChatObject>
      <!-- </div> -->
    </template>

    <template #bottom>
      <div>完成</div>
    </template>
  </z-paging>
  <MemberPop ref="profileRef" :id="id"></MemberPop>
</template>
<script lang="ts" setup>
import { getMembers } from '@/api/chatApi';
import { usePaging } from '@/hooks/usePaging';
import ChatObject from '@/pages/chat/components/ChatObject.vue';
import SessionUnitSkeleton from '@/pages/chat/components/SessionUnitSkeleton.vue';
import Date from '@/pages/chat/components/Date.vue';
import MemberPop from '@/pages/chat/components/MemberPop.vue';
import Divider from '@/pages/chat/components/Divider.vue';
const title = computed(() => `成员列表`);
const name = ref('555');
const profileRef = ref<InstanceType<typeof MemberPop>>();
const props = defineProps({
  id: String,
});

const { pagingRef, dataList, queryList, isPending, isEof, query, reload, totalCount } =
  usePaging<Chat.SessionUnitMemberDto>({
    input: {
      id: props.id,
      keyword: '',
      maxResultCount: 20,
    },
    service: getMembers,
    // format: (res, input) => {
    //   return res;
    // },
  });

const onMemberClick = (item: Chat.SessionUnitDto, index: number) => {
  console.log('onMemberClick', item, index);
};
const showMemberPop = (item: any) => {
  profileRef.value?.show(item);
};
const loadingMoreClick = () => {
  console.log('loadingMoreClick');
  pagingRef.value?.doLoadMore('click');
};
</script>
<style lang="scss" scoped></style>
