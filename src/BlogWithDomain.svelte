<script>
  import { navigate } from 'svelte-routing'
  import { onMount } from 'svelte'
  import { gun } from './contexts.js'
  import { getNode } from './stores.js'
  export let slug
  
  let pub, folderSlug
  let user, path, blog, pages, page, isLoading, isDoneAppend
  const domainMap = {
    'vuau.me': {
      pub: 'J6ul10B2pvF1kr0ddHiEqtHbSsbzT06RtDQiJj90VhI.mQ5Ac2NgzzXGor_zgc0Hngl2-LVEN5frIhMju5r1HRc',
      slug: 'blog'
    },
    'test.localhost': {
      pub: '_GUKWWJNelWVKV5XDF4REIXOeTi4z4I0U0RztCKYRkg._aaJK4Rpx9rz4c1vxL8ilmxS9lyT1GGeVG9_ToCmBE8',
      slug: 'blog'
    }
  }

  onMount(() => {
    isLoading = true
    const domainInfo = getDomainInfo()
    if (!domainInfo) {
      isLoading = false
      return
    }
    pub = domainInfo.pub
    folderSlug = domainInfo.slug

    user = gun.user(pub)
    user
      .get('slugs')
      .get(folderSlug)
      .on(v => {
        path = v
        if (path) {
          getData()
        }
      })
  })
  function getDomainInfo () {
    return domainMap[location.hostname]
  }
  function clickPage (href) {
    navigate(href)
    window.scrollTo(0, 0)
  }
  function getData () {
    getNode(path, user).on(node => {
      if (!node) return
      if (node.type === 'folder') {
        blog = node
        if (blog.headerTag && !isDoneAppend) {
          const doc = document
            .createRange()
            .createContextualFragment(blog.headerTag)
          document.head.appendChild(doc)
          isDoneAppend = true
        }
        pages = {}
        getNode(path, user)
          .get('children')
          .map()
          .on((node, id) => {
            if (node && node.mode === 'public') {
              pages[id] = node
              if (node.slug === slug) {
                page = node
                isLoading = false
              }
              // reactive
              pages = pages
              isLoading = false
            }
          })
      }
    })
  }
</script>

<svelte:head>
  <title>
    {blog ? `${blog.title}${page ? ' - ' : ''}` : ''}{page ? `${page.title}` : ''}
  </title>
</svelte:head>

<section class="mw8 pa3 center avenir">
  {#if isLoading}
    Loading...
  {:else}
    {#if blog && blog.title}
      <h1 class="f2 f1-m f-headline-l pv2">
        <a
          on:click|preventDefault={() => clickPage('/')}
          class="link"
          href="/">
          {blog.title}
        </a>
      </h1>
    {:else if page && page.title}
      <h1 class="baskerville fw1 ph3 ph0-l pv2">{page.title}</h1>
    {/if}

    {#if slug && page}
      {#if folderSlug && slug}
        <h2 class="f2 f2-m f-subheadline-l measure lh-title fw1 mt0 pb2">
          {page.title}
        </h2>
      {/if}
      <article>
        {@html page.content}
      </article>
    {/if}
    {#if !slug && blog}
      {#if pages}
        {#each Object.values(pages) as page}
          <article class="bt b--black-10">
            <a
              on:click|preventDefault={() => clickPage(page.slug)}
              class="db pv3 pv4-ns no-underline black dim"
              href={page.slug}>
              <div class="flex flex-column flex-row-ns">
                <h1 class="f3 fw1 baskerville mt0 lh-title">{page.title}</h1>
              </div>
            </a>
          </article>
        {/each}
      {/if}
    {/if}
    {#if !blog && !page}Not found!{/if}
  {/if}
  <footer class="pv4 bt b--black-10 black-70">
    <p class="f6 db b lh-solid">
      © Powered by
      <a class="link" href="https://app.denote.link">deNOTE</a>
    </p>
  </footer>
</section>
