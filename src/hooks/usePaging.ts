// import { ref } from "vue";

interface PagingOptions<T extends ChatApi.GetListInput> {
  url?: string; // 请求地址
  method?: string; // 请求方法
  pageSize?: number; // 每页条数
  input?: T;
  service?: (queryInput: QueryInput) => Promise<PagingResult>; // 分页请求服务函数
  [key: string]: any;
}

interface QueryInput {
  skipCount?: number | null; // 当前页码
  maxResultCount: number | null; // 每页条数
  keyword?: string | null; // 搜索关键字
  sorting?: string | null; // 排序字段
  [key: string]: any;
}

interface PagingResult {
  items: any[]; // 当前页数据
  totalCount: number; // 总条数
}

const defaultService = (queryInput: QueryInput): Promise<PagingResult> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        items: Array.from({ length: queryInput.maxResultCount || 20 }, (_, index) => ({
          id: (queryInput.skipCount || 0) + index + 1,
          title: `第${
            Math.floor((queryInput.skipCount || 0) / (queryInput.maxResultCount || 20)) + 1
          }页数据 - ${index + 1}`,
        })),
        totalCount: 100, // 模拟总条数
      });
    }, 300);
  });
};

export function usePaging<T extends ChatApi.GetListInput>(
  options: PagingOptions<T> = {
    input: { maxResultCount: 20, skipCount: 0 } as T,
    service: defaultService,
  },
) {
  const pagingRef = ref();
  const isPending = ref(false);
  const isEof = ref(false);
  const query = ref<T>({
    maxResultCount: options.input?.maxResultCount || 20, // 每页条数
    ...options.input,
  } as T);

  // v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
  const dataList = ref<any[]>([]);

  const queryList = (pageNo, pageSize) => {
    // 此处请求仅为演示，请替换为自己项目中的请求
    isPending.value = true;

    query.value.skipCount = (pageNo - 1) * pageSize; // 计算当前页码的偏移量
    query.value.maxResultCount = pageSize; // 设置每页条数
    console.log('query', query.value);

    options
      .service?.(query.value)
      .then((res: PagingResult) => {
        console.log('请求结果', res);
        const items = res.items || [];
        isEof.value = items.length < query.value.maxResultCount;
        // dataList.value = query.value.skipCount == 0 ? items : dataList.value.concat(items);
        if (items.length > 0) {
          pagingRef.value.complete(items);
        } else {
          pagingRef.value.complete(false); // 完成分页请求
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
  };
}
