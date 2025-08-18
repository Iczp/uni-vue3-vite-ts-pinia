import ZPaging from '@/uni_modules/z-paging/components/z-paging.vue';

interface PagingOptions<TDto> {
  url?: string; // 请求地址
  method?: string; // 请求方法
  pageSize?: number; // 每页条数
  input?: Chat.GetListInput;
  service?: <T extends Chat.GetListInput>(queryInput: T) => Promise<Chat.PagedResult<TDto>>; // 分页请求服务函数
  format?: (
    res: Chat.PagedResult<TDto>,
    queryInput?: Chat.GetListInput,
  ) => Chat.PagedResult<TDto> | undefined;
  [key: string]: any;
}

const defaultService = <T extends Chat.GetListInput, TDto>(
  queryInput: T,
): Promise<Chat.PagedResult<TDto>> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        items: Array.from({ length: queryInput.maxResultCount || 20 }, (_, index) => ({
          id: (queryInput.skipCount || 0) + index + 1,
          title: `第${
            Math.floor((queryInput.skipCount || 0) / (queryInput.maxResultCount || 20)) + 1
          }页数据 - ${index + 1}`,
        })) as unknown as TDto[],
        totalCount: 100, // 模拟总条数
      });
    }, 300);
  });
};

export function usePaging<TDto>(
  options: PagingOptions<TDto> = {
    input: { maxResultCount: 20, skipCount: 0 },
    service: defaultService,
  },
) {
  console.log('usePaging options', options);
  const pagingRef = ref<InstanceType<typeof ZPaging>>();
  const isPending = ref(false);
  const isEof = ref(false);
  const totalCount = ref(0);
  const query = ref(options.input || { maxResultCount: 20, skipCount: 0 });

  // v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
  const dataList = ref<TDto[]>([]);

  const queryList = (pageNo: number, pageSize: number) => {
    console.log('queryList', pageNo, pageSize);
    // 此处请求仅为演示，请替换为自己项目中的请求
    isPending.value = true;

    // 计算当前页码的偏移量
    query.value.skipCount = (pageNo - 1) * pageSize;
    // 使用已经加载的数据长度作为偏移量
    // query.value.skipCount = dataList.value.length;

    query.value.maxResultCount = pageSize; // 设置每页条数

    console.log('query', query.value);
    options
      .service?.(query.value)
      .then((res: Chat.PagedResult<TDto>) => {
        console.log('请求结果', res);
        if (options.format) {
          res = options.format(res, query.value) || res;
        }
        if (pageNo == 1) {
          // dataList.value = [];
        }
        totalCount.value = res.totalCount;
        const items = res.items || [];
        isEof.value = items.length < Number(query.value.maxResultCount);
        // dataList.value = query.value.skipCount == 0 ? items : dataList.value.concat(items);
        if (items.length > 0) {
          setTimeout(() => {
            pagingRef.value.completeByKey(items, 'id');
          }, 0);
        } else {
          pagingRef.value.complete(true); // 完成分页请求
        }
      })
      .catch(error => {
        console.error('请求失败', error);
        pagingRef.value.complete([]); // 请求失败时也需要调用complete
      })
      .finally(() => {
        isPending.value = false;
        // 可以在这里做一些清理工作，比如重置状态等
      });
  };

  const reload = () => {
    pagingRef.value?.reload();
  };

  return {
    pagingRef,
    dataList,
    queryList,
    isPending,
    query,
    reload,
    isEof,
    totalCount,
  };
}
