import { get } from 'svelte/store';

import type { AmazonAccount, AmazonAccountRegion } from '~/models';
import { settingsStore } from '~/store';

export const AmazonRegions: Record<AmazonAccountRegion, AmazonAccount> = {
  global: {
    name: 'Global',
    hostname: 'amazon.co.jp',
    kindleReaderUrl: 'https://read.amazon.co.jp',
    notebookUrl: 'https://read.amazon.co.jp/notebook',
  },
  japan: {
    name: 'Japan',
    hostname: 'amazon.co.jp',
    kindleReaderUrl: 'https://read.amazon.co.jp',
    notebookUrl: 'https://read.amazon.co.jp/notebook',
  },
};

export const currentAmazonRegion = (): AmazonAccount => {
  const selectedRegion = get(settingsStore).amazonRegion;
  return AmazonRegions[selectedRegion];
};
