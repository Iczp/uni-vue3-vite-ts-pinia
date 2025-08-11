<template>
  <z-paging
    ref="pagingRef"
    :refresher-only="true"
    @scroll="onScroll"
    @refresh="onRefresh"
    :auto="false"
  >
    <template #top>
      <AppNavBar
        :title="title"
        class="bg-white"
        :isBack="true"
        :isMore="false"
        :border="false"
      ></AppNavBar>
    </template>

    <CellGroup>
      <Cell class="before-none" :arrow="false">
        <template #label>
          <div class="py-12 flex flex-row gap-12">
            <Avatar :size="56" :item="owner" />
            <div class="max-w-240 flex flex-col gap-8 lh-relaxed">
              <div class="flex items-center text-ellipsis text-16 font-bold h-28">
                <span v-if="isSkeleton" class="skeleton inline-flex h-20 w-56"></span>
                <span v-else>{{ owner?.name || '-' }}</span>
                <Gender :gender="owner?.gender" class="ml-4"></Gender>
              </div>
              <div class="text-ellipsis text-14 text-dark-50 h-24">
                <span class="text-gray">账号:</span>
                <span v-if="isSkeleton" class="skeleton inline-flex h-16 w-64"></span>
                <span class="ml-8" v-else>{{ owner?.code }}</span>
              </div>
              <div class="text-ellipsis text-14 text-dark-100 h-24">
                <span class="text-gray">地区:</span>
                <span v-if="isSkeleton" class="skeleton inline-flex h-16 w-64"></span>
                <span v-else class="ml-8">{{ owner?.area || '-' }}</span>
              </div>
            </div>
          </div>
        </template>
      </Cell>

      <Cell v-if="owner?.description">
        <template #label>
          <div class="lh-relaxed my-8 line-clamp-2 overflow-hidden text-gray break-words">
            {{ owner?.description }}
          </div>
        </template>
      </Cell>
    </CellGroup>

    <CellGroup>
      <Cell icon="i-ic:round-recycling" label="好友圈" arrow>
        <template #value>
          <Badge class="gray" :count="10" :max="99"></Badge>
        </template>
      </Cell>
    </CellGroup>

    <CellGroup>
      <Cell label="所在的群" :value="destination?.name" arrow></Cell>
      <Cell label="群内名称" :value="setting?.memberName || '-'"></Cell>
    </CellGroup>

    <CellGroup>
      <Cell label="账号类型" :value="sessionUnit?.ownerObjectType"></Cell>
      <Cell label="加入方式" :value="setting?.joinWay"></Cell>
      <Cell
        v-if="sessionUnit?.creationTime"
        label="加入时间"
        :value="sessionUnit?.creationTime"
        format="YYYY-MM-DD hh:mm:ss"
      ></Cell>
      <Cell
        v-if="setting?.lastSendTime"
        label="最后发言时间"
        :value="setting?.lastSendTime"
        format="YYYY-MM-DD hh:mm:ss"
        empty="从未发言"
      ></Cell>
    </CellGroup>
  </z-paging>
</template>

<script lang="ts" setup>
import CellGroup from '@/pages/chat/components/CellGroup.vue';
import Cell from '@/pages/chat/components/Cell.vue';
import Badge from '@/pages/chat/components/Badge.vue';
import Avatar from '@/pages/chat/components/Avatar.vue';
import Gender from '@/pages/chat/components/Gender.vue';
import { useUser } from '@/store/user';
import { useAuth } from '@/store/auth';
import { useChatStore } from '@/store/chatStore';
import { userHeader } from '@/api/userHeader';
import { getChatObjectDetail, getSessionUnitItemDetail } from '@/api/chatApi';
import { useSessionUnitDetail } from '@/hooks/useSessionUnitDetail';

const props = defineProps({
  id: {
    type: String,
  },
  title: {
    type: String,
    default: '用户信息',
  },
});
const { sessionUnit, owner, destination, isPending, setting } = useSessionUnitDetail({
  sessionUnitId: props.id!,
  auto: false,
});

const isSkeleton = computed(() => !sessionUnit.value);

// const isSkeleton = ref(true);

// setTimeout(() => {
//   isSkeleton.value = false;
// }, 2000);

const chatObject = ref();

const title = ref('用户信息');

const chatStore = useChatStore();

const userStore = useUser();

const authStore = useAuth();

const env = ref(import.meta.env);
const pagingRef = ref();

const onRefresh = () => {
  loadData();
  console.log('刷新');
};
const login = () => {
  authStore
    .fetchToken(userHeader)
    .then(res => {
      uni.showToast({
        title: '登录成功',
        icon: 'success',
      });
    })
    .catch(err => {
      console.error(err);
      uni.showToast({
        title: `${err.data?.error || '登录失败'}${err.data?.error_description}`,
        icon: 'none',
      });
    });
};
const refreshToken = () => {
  authStore.refreshToken().then(res => {
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
    });
  });
};

const opacity = ref(0);

const loadData = () => {
  if (chatStore.current?.id) {
    getSessionUnitItemDetail({ id: props.id! })
      .then(res => {
        sessionUnit.value = res;
        chatObject.value = res.owner;
        pagingRef.value?.complete(true);
      })
      .catch(err => {
        pagingRef.value?.complete(false);
      });
  }
};

const onScroll = e => {
  // console.log("滚动事件", e);
  opacity.value = Math.min(e.detail.scrollTop / 400, 1);
  // console.log("滚动透明度", opacity.value);
};
onMounted(() => {
  // 页面加载时可以执行一些初始化操作
  console.log('Message page mounted');
  loadData();
});
</script>

<style lang="scss" scoped></style>
