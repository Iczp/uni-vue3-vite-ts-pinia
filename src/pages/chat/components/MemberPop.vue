<template>
  <u-popup v-model="isVisible" mode="bottom" border-radius="14">
    <div class="pop-page flex flex-col flex-1 bg-gray-100">
      <CellGroup>
        <Cell class="before-none" :arrow="false" v-ripple="'rgba(0, 0, 0, 0.3)'">
          <template #label>
            <div class="py-12 flex flex-row gap-12">
              <Avatar :size="56" :item="owner" />
              <div class="max-w-240 flex flex-col gap-8 justify-center lh-relaxed">
                <div class="flex items-center text-ellipsis text-16 font-bold h-28">
                  <span v-if="isSkeleton" class="skeleton inline-flex h-20 w-56"></span>
                  <span v-else>{{ owner?.name || '-' }}</span>
                  <Gender v-if="owner?.gender" :gender="owner?.gender" class="ml-4"></Gender>
                </div>
                <div v-if="owner?.code" class="text-ellipsis text-14 text-dark-50 h-24">
                  <span class="text-gray">账号:</span>
                  <span v-if="isSkeleton" class="skeleton inline-flex h-16 w-64"></span>
                  <span class="ml-8" v-else>{{ owner?.code || '-' }}</span>
                </div>
                <div v-if="setting?.memberName" class="text-ellipsis text-14 text-dark-50 h-24">
                  <span class="text-gray">群昵称:</span>
                  <span v-if="isSkeleton" class="skeleton inline-flex h-16 w-64"></span>
                  <span class="ml-8" v-else>{{ setting?.memberName || '-' }}</span>
                </div>
                <div v-if="owner?.area" class="text-ellipsis text-14 text-dark-100 h-24">
                  <span class="text-gray">地区:</span>
                  <span v-if="isSkeleton" class="skeleton inline-flex h-16 w-64"></span>
                  <span v-else class="ml-8">{{ owner?.area || '-' }}</span>
                </div>
              </div>
            </div>
          </template>
        </Cell>
        <Cell>
          <template #label>
            <div class="flex flex-row gap-12 text-16 text-gray">
              <div class="i-ic:round-alternate-email"></div>
              <div class="i-ic:round-favorite"></div>
              <div class="i-ic:round-favorite-border"></div>
              <div class="i-ic:round-alarm"></div>
              <div class="i-ic:round-waving-hand"></div>
              <div class="i-ic:round-speaker-notes-off"></div>
              <div class="i-ic:round-coffee"></div>
              <div class="i-ic:round-more-vert"></div>
              <div class="i-ic:round-chat"></div>
            </div>
          </template>
        </Cell>

        <Cell v-if="owner?.description" :arrow="false">
          <template #label>
            <div class="lh-relaxed line-clamp-2 overflow-hidden text-gray break-words">
              {{ owner?.description }}
            </div>
          </template>
        </Cell>
        <Cell v-if="!isMe" label="查看详情" @click="navToProfile(senderSessionUnit)" arrow></Cell>
      </CellGroup>

      <CellGroup v-if="isShowDetail">
        <Cell label="账号类型" :value="senderSessionUnit?.ownerObjectType"></Cell>
        <Cell label="加入方式" :value="setting?.joinWay"></Cell>
        <Cell
          v-if="senderSessionUnit?.creationTime"
          label="加入时间"
          :value="senderSessionUnit?.creationTime"
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

      <div v-if="!isMe" class="flex flex-row items-stretch gap-12 p-12 bg-white mt-12">
        <u-button v-if="isFriendship" class="flex flex-1" @click="onSend">发送信息</u-button>
        <u-button v-else class="flex flex-1">添加为好友</u-button>
      </div>
    </div>
  </u-popup>
</template>
<script lang="ts" setup>
import Avatar from '@/pages/chat/components/Avatar.vue';
import Gender from '@/pages/chat/components/Gender.vue';
import CellGroup from '@/pages/chat/components/CellGroup.vue';
import Cell from '@/pages/chat/components/Cell.vue';
import { useSessionUnitDetail } from '@/hooks/useSessionUnitDetail';
import { navTo, navToChat } from '@/utils/nav';

import { ObjectTypes } from '@/utils/enums';
import { getMember } from '@/api/chatApi';

const props = defineProps({
  // 会话单元ID
  id: {
    type: String,
    default: '',
  },
});

const isSkeleton = computed(() => !senderSessionUnit.value);

const senderSessionUnit = ref<Chat.SessionUnitMemberDto>();
const setting = computed(() => senderSessionUnit.value?.setting);
// const { sessionUnit } = useSessionUnitDetail({
//   sessionUnitId: props.id,
//   auto: false,
// });
const isVisible = ref(false);

const isMe = computed(() => senderSessionUnit.value?.id == props.id);

const owner = computed(() => senderSessionUnit.value?.owner);

const isShowDetail = computed(
  () =>
    isMe.value ||
    (0 && [ObjectTypes.Personal].some(x => senderSessionUnit.value?.ownerObjectType === x)),
);
const show = (item: any) => {
  isVisible.value = true;
  senderSessionUnit.value = item;
  if (item.id != props.id) {
    loadMember(item.id);
  }
};

const loadMember = (destinationId: string) => {
  getMember({ id: props.id, destinationId })
    .then(res => {})
    .catch(err => {});
};

const isFriendship = computed(() => senderSessionUnit.value?.isFriendship);
const friendshipName = computed(() => senderSessionUnit.value?.friendshipName);
const friendshipSessionUnitId = computed(() => senderSessionUnit.value?.friendshipSessionUnitId);

const onSend = () => {
  // 如果是好友会话，则直接发送信息
  console.log('onSend', friendshipSessionUnitId.value);
  if (isFriendship.value && friendshipSessionUnitId.value) {
    isVisible.value = false;
    navToChat({
      id: friendshipSessionUnitId.value!,
      title: friendshipName.value,
    });
  } else {
    // 否则，先添加为好友
    uni.showToast({ title: '暂不支持非好友会话发送信息', icon: 'none' });
  }
};
const navToProfile = (item: any) => {
  console.log('navToProfile', item);
  isVisible.value = false;
  navTo({ url: `/pages/chat/profiles/profile?id=${item.id}&vid=${props.id}` });
};

defineExpose({
  show,
});
</script>
