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
      <AppNavBar
        :title="title"
        :isBack="true"
        :isMore="true"
        :border="false"
        @more="onMore"
      ></AppNavBar>
      <div class="sticky top-0 z-9 p-12 pt-0 border-after">
        <u-search
          placeholder="搜索成员"
          v-model="keyword"
          @search="onSearch"
          @custom="onSearch"
        ></u-search>
      </div>
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
      <div class="flex flex-row items-center active">
        <!-- <div v-if="isSelector" class="ml-12">
          <CheckBox v-model="item.checked" />
        </div> -->
        <ChatObject
          class="px-12 py-6 flex-1"
          :size="48"
          :item="item.owner"
          :index="index"
          :active="!isSelector"
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
          <template #footer>
            <CheckBox @click.stop v-model="item.checked" />
          </template>
        </ChatObject>
      </div>
    </template>

    <template v-if="isSelector" #bottom>
      <div class="flex flex-row justify-between justify-center p-12 gap-12 bg-white border-before">
        <div class="flex items-center text-gray">
          当前选择中
          <span class="font-bold text-dark-50 px-4">{{ selectedCount }}</span>
          人
        </div>
        <div class="flex flex-row gap-12">
          <u-button class="flex flex-1">移出成员</u-button>
          <u-button class="flex flex-1">设置角色</u-button>
        </div>
      </div>
    </template>
  </z-paging>
  <MemberPop ref="profileRef" :id="id"></MemberPop>
</template>
<script lang="ts" setup>
import { getMembers } from '@/api/chatApi';
import { usePaging } from '@/hooks/usePaging';
import ChatObject from '@/pages/im/components/ChatObject.vue';
import CheckBox from '@/components/CheckBox.vue';
import SessionUnitSkeleton from '@/pages/im/components/SessionUnitSkeleton.vue';
import Date from '@/pages/im/components/Date.vue';
import MemberPop from '@/pages/im/components/MemberPop.vue';
import Divider from '@/pages/im/components/Divider.vue';
const title = computed(() => `成员列表`);
const name = ref('555');
const profileRef = ref<InstanceType<typeof MemberPop>>();
const props = defineProps({
  id: String,
});

const keyword = ref('');
const isSelector = ref(false);
const { pagingRef, dataList, queryList, isPending, isEof, query, reload, totalCount } =
  usePaging<Chat.SessionUnitMemberDto>({
    input: {
      id: props.id,
      keyword: '',
      maxResultCount: 20,
    },
    service: getMembers,
    format: (res, input) => {
      res.items.map(x => {
        x.checked = false;
      });
      return res;
    },
  });

const selectedCount = computed(() => {
  return dataList.value.filter(x => x.checked).length;
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

const onMore = () => {
  isSelector.value = !isSelector.value;
  if(isSelector.value){
    dataList.value.map(x=>{
      x.checked = false;
    })
  }
  console.log('onMore');
};

const onSearch = () => {
  query.value!.keyword = keyword.value;
  reload();
};
</script>
<style lang="scss" scoped></style>
