import cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return new Response(`Username not found`);
  }

  try {
    const url = `https://github.com/${username}`;
    const html = await fetch(url).then((res) => res.text());

    const $ = cheerio.load(html);

    const pinned = $('.pinned-item-list-item.public').toArray();

    if (!pinned || pinned.length === 0) return [];

    const results = pinned.map((item) => {
      const owner = getOwner($, item);
      const repo = getRepo($, item);

      return {
        owner: owner || username,
        name: repo,
        link: `https://github.com/${owner || username}/${repo}`,
        description: getDescription($, item),
        language: getLanguage($, item),
        color: getLanguageColor($, item),
      };
    });

    return new Response(JSON.stringify(results));
  } catch (err) {
    return new Response(`Failed to retrieve pinned repos`, {
      status: 500,
    });
  }
}

function getOwner($: cheerio.Root, item: cheerio.Element) {
  return $(item).find('.owner').text();
}

function getRepo($: cheerio.Root, item: cheerio.Element) {
  return $(item).find('.repo').text();
}

function getDescription($: cheerio.Root, item: cheerio.Element) {
  return $(item).find('.pinned-item-desc').text().trim();
}

function getLanguage($: cheerio.Root, item: cheerio.Element) {
  return $(item).find('[itemprop="programmingLanguage"]').text();
}

function getLanguageColor($: cheerio.Root, item: cheerio.Element) {
  return $(item).find('.repo-language-color').css('background-color');
}
