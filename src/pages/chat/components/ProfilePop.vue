<template>
  <u-popup v-model="isVisible" mode="bottom" border-radius="14">
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
      <Cell icon="i-ic:round-settings" label="查看详情" arrow></Cell>
    </CellGroup>
  </u-popup>
</template>
<script lang="ts" setup>
import Avatar from '@/pages/chat/components/Avatar.vue';
import CellGroup from '@/pages/chat/components/CellGroup.vue';
import Cell from '@/pages/chat/components/Cell.vue';
import { useSessionUnitDetail } from '@/hooks/useSessionUnitDetail';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },
});

const isSkeleton = computed(() => !sessionUnit.value);

const { sessionUnit, owner } = useSessionUnitDetail({
  sessionUnitId: props.id,
  auto: false,
});
const isVisible = ref(false);
const show = (item: any) => {
  isVisible.value = true;
  sessionUnit.value = item;
};

defineExpose({
  show,
});
</script>
