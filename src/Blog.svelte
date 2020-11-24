<script>
  import { navigate } from 'svelte-routing'
  import { onMount } from 'svelte'
  import { gun } from './contexts.js'
  import { getNode, getData, domainMap } from './stores.js'
  export let slug1
  export let slug2
  export let pub

  let user, path, blog, pages, page, isAppended, isLoading, isUseDomain

  onMount(async () => {
    isLoading = true
    if (window.__DATA__) {
      console.log(window.__DATA__)
      ;({ blog, pages, page } = window.__DATA__)
      isLoading = false
      window.__DATA__ = null
      return
    }
    if (!pub) {
      isUseDomain = true
      const domainInfo = domainMap[location.hostname]
      if (!domainInfo) {
        isLoading = false
        return
      }
      pub = domainInfo.pub
      slug1 = domainInfo.slug
    }
    if (slug1) {
      ;({ blog, pages } = await getData({ slug: slug1, pub }))
      injectHead(blog)
    }
    if (slug2) {
      page = await getData({ slug: slug2, pub })
    }
    isLoading = false
  })

  function injectHead (blog) {
    if (blog.headerTag && !isAppended) {
      const doc = document
        .createRange()
        .createContextualFragment(blog.headerTag)
      document.head.appendChild(doc)
      isAppended = true
    }
  }
  function clickPage (href) {
    navigate(href)
    window.scrollTo(0, 0)
  }
  function getBlogURL () {
    if (isUseDomain) {
      return '/'
    }
    return `/${slug1}/${pub}`
  }
  function getPageURL (slug) {
    if (isUseDomain) {
      return `/${slug}`
    }
    return `/${slug1}/${slug}/${pub}`
  }
</script>

<svelte:head>
  <title>
    {blog ? `${blog.title}${page ? ' - ' : ''}` : ''}{page ? `${page.title}` : ''}
  </title>
</svelte:head>

{#if !isLoading}
  {#if blog || page}
    <section class="mw8 pa3 center avenir">
      {#if blog && blog.title}
        <h1 class="f2 f1-m f-headline-l pv2">
          <a
            on:click|preventDefault={() => clickPage(getBlogURL())}
            class="link"
            href={getBlogURL()}>
            {blog.title}
          </a>
        </h1>
      {:else if page && page.title}
        <h2 class="f2 f2-m f-subheadline-l measure lh-title fw1 mt0 pb2">
          {page.title}
        </h2>
      {/if}

      {#if page}
        {#if slug1 && slug2}
          <h2 class="f2 f2-m f-subheadline-l measure lh-title fw1 mt0 pb2">
            {page.title}
          </h2>
        {/if}
        <article>
          {@html page.content}
        </article>
      {/if}
      {#if !slug2 && blog}
        {#if pages}
          {#each Object.values(pages) as page}
            <article class="bt b--black-10">
              <a
                on:click|preventDefault={() => clickPage(getPageURL(page.slug))}
                class="db pv3 pv4-ns no-underline black dim"
                href={getPageURL(page.slug)}>
                <div class="flex flex-column flex-row-ns">
                  <h1 class="f3 fw1 baskerville mt0 lh-title">{page.title}</h1>
                </div>
              </a>
            </article>
          {/each}
        {/if}
      {/if}
      <footer class="pv4 bt b--black-10 black-70">
        <p class="f6 db b lh-solid">
          © Powered by
          <a class="link" href="https://app.denote.link">deNOTE</a>
        </p>
      </footer>
    </section>
  {:else}Not found.{/if}
{/if}
