<template>
  <div>
    <z-paging
      ref="pagingRef"
      :refresher-only="true"
      @onRefresh="onRefresh"
      :defaultPageSize="999"
      :auto="true"
    >
      <template #top>
        <AppNavBar :title="title" :isBack="true" :border="true"></AppNavBar>
      </template>

      <div class="setting-page" :style="pageStyle">
        <!-- <div>isHtml5Plus:{{ isHtml5Plus }}</div>
      <div>{{ userAgent }}</div> -->

        <div class="bg-white border-after relative p-12 flex flex-col gap-8">
          <div class="flex flex-row flex-wrap gap-y-8 box-border">
            <ChatObject
              v-if="isPending && dataList.length == 0"
              v-for="item in skeletonCount"
              :vertical="true"
              :key="item"
              class="flex w-[20%] flex-center"
            />
            <ChatObject
              v-for="(item, index) in dataList"
              :key="item.id"
              :item="item.owner"
              :size="48"
              :vertical="true"
              class="flex w-[20%] flex-center"
              @click="showMemberPop(item)"
            />

            <div class="flex w-[20%] justify-center">
              <div
                class="border-1 border-dashed border-gray-200 rounded-full w-48 h-48 flex flex-center"
              >
                <i class="i-ic:round-plus text-24 text-gray-400"></i>
              </div>
            </div>
            <div class="flex w-[20%] justify-center">
              <div
                class="border-1 border-dashed border-gray-200 rounded-full w-48 h-48 flex flex-center"
              >
                <i class="i-ic:round-minus text-24 text-gray-400"></i>
              </div>
            </div>
          </div>
          <div class="flex flex-center">
            <span class="text-sky-500 text-12" @click="navToGroupMembers">
              查看更多({{ totalCount }})
            </span>
          </div>
        </div>

        <CellGroup>
          <Cell label="类型" :value="destinationObjectType" arrow></Cell>
        </CellGroup>
        <!-- destinationObjectType: {{ destinationObjectType }} -->
        <!-- label="群设置" -->
        <CellGroup v-if="destinationObjectType == ObjectTypes.Room">
          <Cell label="群名称" :value="groupName" @click="navToGroupName" arrow></Cell>
          <Cell
            label="群二维码"
            @click="navToGroupQrcode"
            valueIcon="i-ic:round-qrcode"
            arrow
          ></Cell>
          <Cell label="群管理" @click="navToGroupManage" arrow></Cell>
          <Cell label="群公告" arrow></Cell>
          <Cell label="备注" @click="navToRemark" arrow></Cell>
        </CellGroup>

        <CellGroup>
          <Cell label="查找聊天记录" @click="navToLogs" arrow></Cell>
        </CellGroup>

        <CellGroup label="设置">
          <Cell label="免打扰" :active="false">
            <switch :checked="isImmersed" color="#298fff" style="transform: scale(0.84);" />
          </Cell>
          <Cell label="置顶聊天" :active="false">
            <switch :checked="isToping" color="#298fff" style="transform: scale(0.84);" />
          </Cell>
          <Cell label="提醒" :active="false">
            <switch :checked="isRemind" color="#298fff" style="transform: scale(0.84);" />
          </Cell>
        </CellGroup>

        <CellGroup>
          <Cell label="设置聊天背景" :disabled="true" arrow></Cell>
        </CellGroup>

        <CellGroup>
          <Cell label="清空聊天记录" arrow></Cell>
        </CellGroup>

        <CellGroup>
          <Cell label="投诉" arrow></Cell>
        </CellGroup>
      </div>
    </z-paging>
    <MemberPop ref="profileRef" :id="id"></MemberPop>
  </div>
</template>

<script lang="ts" setup>
// import MessageViewer from './components/MessageViewer.vue';
import MemberPop from '@/pages/chat/components/MemberPop.vue';
import Cell from '@/pages/chat/components/Cell.vue';
import CellGroup from '@/pages/chat/components/CellGroup.vue';
import ChatObject from '@/pages/chat/components/ChatObject.vue';
import { getMembers, getSessionUnitItem, getSessionUnitItemDetail } from '@/api/chatApi';
import { isHtml5Plus } from '@/utils/platform';
import { ObjectTypes } from '@/utils/enums';
import { usePaging } from '@/hooks/usePaging';
import { navTo } from '@/utils/nav';
const props = defineProps({
  // sessionUnitId
  id: {
    type: [String],
    default: 'e52bacf4-c231-061a-6628-3a0b0cf571fb',
    // required: true,
  },
  title: {
    type: String,
    default: '聊天设置',
  },
  count: {
    type: [Number, String],
    default: 13,
  },
  objectType: {
    type: [String, Number],
    default: 0,
  },
});
const profileRef = ref<InstanceType<typeof MemberPop>>();
const userAgent = navigator.userAgent;
const totalCount = ref(0);
const title = ref(props.title);
const sessionUnit = ref<Chat.SessionUnitDto | null>(null);
const setting = computed(() => sessionUnit.value?.setting);
const destination = computed(() => sessionUnit.value?.destination);
const isInputEnabled = computed(() => setting.value?.isInputEnabled || false);
const isShopkeeperOrWaiter = computed(() =>
  [ObjectTypes.ShopKeeper, ObjectTypes.ShopWaiter].includes(
    sessionUnit.value?.ownerObjectType || ObjectTypes.Anonymous,
  ),
);
const isPending = ref(false);
const pagingRef = ref();
const dataList = ref<Chat.SessionUnitMemberDto[]>([]);

const skeletonCount = ref(Math.min(13, Number(props.count)));

const groupName = ref('');

const isImmersed = ref(false);
const isToping = ref(false);
const isRemind = ref(false);

const destinationObjectType = computed(
  () => sessionUnit.value?.destinationObjectType || destination.value?.objectType,
);
const windowHeight = uni.getSystemInfoSync().windowHeight;
console.log(windowHeight);
const pageStyle = reactive({
  // height: `${windowHeight}px`,
});

const onScroll = e => {
  console.log('onScroll', e);
};

const navToGroupName = () => {
  navTo({ url: '/pages/chat/sessions/group-name', query: { id: props.id } });
};
const navToGroupManage = () => {
  navTo({ url: '/pages/chat/sessions/group-manage', query: { id: props.id } });
};
const navToRemark = () => {
  navTo({ url: '/pages/chat/sessions/remark', query: { id: props.id } });
};
const navToGroupMembers = () => {
  navTo({ url: `/pages/chat/sessions/group-members?id=${props.id}` });
};
const navToGroupQrcode = () => {
  navTo({ url: `/pages/chat/sessions/group-qrcode?id=${props.id}` });
};
const navToLogs = () => {
  navTo({ url: `/pages/chat/sessions/logs?id=${props.id}` });
};
const navToProfile = (item: any) => {
  console.log('navToProfile', item);
  navTo({ url: `/pages/chat/profiles/profile?id=${item.id}&vid=${props.id}` });
};
const showMemberPop = (item: any) => {
  profileRef.value?.show(item);
};

const onRefresh = () => {
  console.log('onRefresh');
  isPending.value = true;
  Promise.all([
    getSessionUnitItem({ id: props.id }),
    getMembers({ id: props.id, maxResultCount: 13 }),
  ])
    .then(([sessionUnitRes, destinationListRes]) => {
      console.log('getSessionUnitItem', sessionUnitRes);
      // title.value =
      //   sessionUnitRes.destination?.displayName || sessionUnitRes.destination?.name || '';
      // if (sessionUnitRes.destination?.objectType == ObjectTypes.Room) {
      //   title.value += `(${sessionUnitRes.sessionUnitCount})`;
      // }
      sessionUnit.value = sessionUnitRes;
      groupName.value = sessionUnitRes.destination?.name || '';

      dataList.value = destinationListRes.items;
      totalCount.value = destinationListRes.totalCount;
      pagingRef.value?.complete();
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      pagingRef.value?.complete(false);
    })
    .finally(() => {
      isPending.value = false;
    });

  // getSessionUnitItem({ id: props.id }).then(res => {
  //   console.log('getSessionUnitItem', res);
  //   // title.value = res.destination?.displayName || res.destination?.name || '';
  //   // if (res.destination?.objectType == ObjectTypes.Room) {
  //   //   title.value += `(${res.sessionUnitCount})`;
  //   // }
  //   sessionUnit.value = res;

  //   groupName.value = res.destination?.name || '';
  //   pagingRef.value?.complete();
  // });

  // getDestinationList({ id: props.id, maxResultCount: 13 }).then(res => {
  //   console.log('getDestinationList', res);
  //   dataList.value = res.items;
  //   pagingRef.value?.complete();
  // });
};

onMounted(() => {
  console.log('mounted');
  onRefresh();
  window.visualViewport?.addEventListener('resize', () => {
    // pageStyle.height = `${window?.visualViewport?.height}px`;
  });
});
</script>
<style>
html {
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.settings-page {
  display: flex;
  overflow: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  // width: 100%;
  // height: calc(506px - var(--window-top));
  // height: 100vh;
}
.nav-bar {
  flex-shrink: 0;
  padding-top: 44px;
  height: 44px;
  background: #eee;
}
</style>
