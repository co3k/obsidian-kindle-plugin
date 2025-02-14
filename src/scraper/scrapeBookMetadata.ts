import type { Root } from 'cheerio';

import type { Book, BookMetadata } from '~/models';
import { loadRemoteDom } from './loadRemoteDom';

const parseDetailsList = ($: Root): Omit<BookMetadata, 'authorUrl'> => {
  const detailsListEl = $(
    '#detailBullets_feature_div .detail-bullet-list:first-child li span.a-list-item'
  ).toArray();

  const result = detailsListEl.reduce((accumulator, currentEl) => {
    const key = $('span:first-child', currentEl)
      .text()
      .replace(/[\n\r]+/g, '')
      .replace(':', '');

    const value = $('span:nth-child(2)', currentEl).text();

    return { ...accumulator, [key]: value };
  }, {});

  return {
    isbn: result['Page numbers source ISBN'],
    pages: result['Print length'],
    publication: result['Publication date'],
    publisher: result['Publisher'],
  };
};

const parseIsbn = ($: Root): string | null => {
  // Attempt 1 - Try and fetch isbn from product information popover
  const popoverData = $(
    '#rich_product_information ol.a-carousel span[data-action=a-popover]'
  ).data('a-popover');

  const isbnMatches = popoverData?.inlineContent.match(/(?<=\bISBN\s)(\w+)/g);

  if (isbnMatches) {
    return isbnMatches[0];
  }

  // Attempt 2 - Look for ISBN feature on page
  const isbnFeature = $(
    '#printEditionIsbn_feature_div .a-row:first-child span:nth-child(2)'
  )
    ?.text()
    .trim();

  return isbnFeature;
};

const parseAuthorUrl = ($: Root): string | null => {
  const href = $('.contributorNameID').attr('href');
  return `https://www.amazon.co.jp${href}`;
};

export const parseBookMetadata = ($: Root): BookMetadata => {
  const metadata = parseDetailsList($);

  return {
    ...metadata,
    ...(metadata.isbn === undefined ? { isbn: parseIsbn($) } : {}),
    authorUrl: parseAuthorUrl($),
  };
};

const scrapeBookMetadata = async (book: Book): Promise<BookMetadata> => {
  const dom = await loadRemoteDom(
    `https://www.amazon.co.jp/dp/${book.asin}`,
    1000
  );

  return parseBookMetadata(dom);
};

export default scrapeBookMetadata;
