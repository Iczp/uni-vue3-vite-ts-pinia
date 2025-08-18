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
      <div
        class="flex flex-row items-center"
        :class="{ active: !isDisabled(item.destination) }"
        @click="toggleChecked(item.destination)"
      >
        <!-- <div v-if="isSelector" class="ml-12">
          <CheckBox v-model="item.checked" />
        </div> -->
        <ChatObject
          class="px-12 py-6 flex-1"
          :size="48"
          :item="item.destination"
          :index="index"
          @click="showMemberPop(item)"
          :arrow="false"
        >
          <!-- <template #desc>
            <div class="flex">
              <span class="text-ellipsis text-gray text-12">
                --

              </span>
            </div>
          </template> -->
          <template #actions>
            <!-- <u-checkbox v-model="item.checked" :name="item.name">{{ item.name }}</u-checkbox> -->
            <CheckBox
              :checked="isChecked(item.destination)"
              :disabled="isDisabled(item.destination)"
            />
            <!-- {{ isChecked(item.destination) }}
            {{ isDisabled(item.destination) }}
            {{ item?.destination?.id }} -->
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

          <div class="i-ic:round-keyboard-arrow-down"></div>
        </div>
        <div class="flex flex-row gap-12">
          <u-button type="primary" class="flex flex-1" @click="onClick">确定</u-button>
        </div>
      </div>
    </template>
  </z-paging>
  <!-- <MemberPop ref="profileRef" :id="id"></MemberPop> -->
</template>
<script lang="ts" setup>
import { getContacts, getMembers } from '@/api/chatApi';
import { usePaging } from '@/hooks/usePaging';
import ChatObject from '@/pages/im/components/ChatObject.vue';
import CheckBox from '@/components/CheckBox.vue';
import SessionUnitSkeleton from '@/pages/im/components/SessionUnitSkeleton.vue';
import Date from '@/pages/im/components/Date.vue';
import MemberPop from '@/pages/im/components/MemberPop.vue';
import Divider from '@/pages/im/components/Divider.vue';

import { invoke } from '@/hooks/usePicker';
import UButton from '@/uni_modules/vk-uview-ui/components/u-button/u-button.vue';
import { useChatStore } from '@/store/chatStore';
import { usePicker } from '@/hooks/usePicker1';

const props = defineProps({
  title: {
    type: String,
    default: '请选择',
  },
  event: {
    type: String,
    default: '',
  },
  id: {
    type: [String, Number],
    default: '',
  },
  disabled: {
    type: String,
    default: '[]',
  },
  selected: {
    type: String,
    default: '[]',
  },
});

const req = ref();
onLoad(e => {
  console.log('onLoad', e);
  req.value = JSON.stringify(e);
});

const onClick = () => {
  if (selectedCount.value == 0) {
    uni.showToast({ title: '请选择成员', icon: 'none' });
    return;
  }
  const selectedItems = getSelectItems();
  invoke({
    event: props.event,
    payload: {
      selectedItems,
    },
  });
};

const title = computed(() => decodeURIComponent(props.title));
const profileRef = ref<InstanceType<typeof MemberPop>>();

const keyword = ref('');
const isSelector = ref(true);
const store = useChatStore();
const ownerId = Number(props.id || 13 || store.current?.id);
const { pagingRef, dataList, queryList, isPending, isEof, query, reload, totalCount } =
  usePaging<Chat.SessionUnitDto>({
    input: {
      ownerId: ownerId,
      objectTypes: [1, 6, 7, 8, 9],
      keyword: '',
      maxResultCount: 20,
    },
    service: getContacts,
    format: (res, input) => {
      res.items.map(x => {
        x.checked = false;
      });
      return res;
    },
  });

const {
  selectable,
  isMultiple,
  isChecked,
  toggleChecked,
  selectedList,
  disabledList,
  isDisabled,
  maxCount,
  picker: pickerRef,
  getSelectItems,
  selectedCount,
} = usePicker({
  picker: {
    // selectedItems: JSON.parse(props.selected || '[]').map(x => ({
    //   id: Number(x.id),
    // })),
    isMultiple: true,
    maxCount: 10,
  },
});

selectedList.value = JSON.parse(decodeURIComponent(props.selected) || '[]').map(x => ({
  id: Number(x),
}));

disabledList.value = JSON.parse(decodeURIComponent(props.disabled) || '[]').map(x => ({
  id: Number(x),
}));

console.log(
  'selectedList',
  selectedList.value,
  decodeURIComponent(props.selected),
  decodeURIComponent(props.disabled),
);

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
  if (isSelector.value) {
    dataList.value.map(x => {
      x.checked = false;
    });
  }
  console.log('onMore');
};

const onSearch = () => {
  query.value!.keyword = keyword.value;
  reload();
};
</script>
<style lang="scss" scoped></style>
