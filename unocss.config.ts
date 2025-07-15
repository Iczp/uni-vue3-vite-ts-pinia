import type { Preset, Rule } from 'unocss';
import { defineConfig, presetAttributify, presetIcons } from 'unocss';
import presetWind3 from '@unocss/preset-wind3';
// import presetIcons from '@unocss/preset-icons';

import presetRemToRpx from './preset-rem-to-rpx';

const sizeMapping: Record<string, string> = {
  fs: 'font-size',
  // t: "font-size",
};

function getSizeRules(Mapping: Record<string, string>): Rule<{}>[] {
  return Object.keys(Mapping).map(key => {
    const value = Mapping[key];
    return [new RegExp(`^${key}-(\\d+)$`), ([, d]) => ({ [value]: `${Number(d) * 2}rpx` })];
  });
}

export default defineConfig({
  presets: [
    // presetAttributify(),
    presetWind3({
      /* 可添加配置选项 */
    }) as any,
    presetRemToRpx({
      baseFontSize: 4,
      // screenWidth: 375, // 设计稿宽度
      // rootFontSize: 16, // 根字体大小
      // unitPrecision: 5, // 转换精度
      // propList: ['*'] // 需要转换的属性
    }) as Preset,
    presetIcons({
      scale: 1.2, // 图标缩放比例
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
        // ...
      },
      collections: {
        // carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
        // mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        // ic: () => import('@iconify-json/ic/icons.json').then(i => i.default),
        // logos: () => import('@iconify-json/logos/icons.json').then(i => i.default),
      },
    }),
  ],
  theme: {
    preflightRoot: ['page,::before,::after'],
  },
  rules: getSizeRules(sizeMapping),
  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',
    'flex-around': 'flex justify-around items-center',
    'flex-column': 'flex flex-col',
    'text-ellipsis': 'overflow-hidden text-ellipsis whitespace-nowrap',
  },
});
