<script>
  import { navigate } from 'svelte-routing'
  import { onMount } from 'svelte'
  import { gun } from './contexts.js'
  import { getNode, getData, domainMap, isHeadTagUpdated } from './stores.js'
  export let slug1
  export let slug2
  export let pub

  let user, path, blog, pages, page, isLoading, isUseDomain

  onMount(async () => {
    isLoading = true
    if (!pub) { // use domain
      isUseDomain = true
      const domainInfo = domainMap[location.hostname]
      if (!domainInfo) {
        isLoading = false
        return
      }
      pub = domainInfo.pub
      slug1 = domainInfo.slug
      if (slug1) {
        ;({ blog, pages } = await getData({ slug: slug1, pub }))
        injectHead(blog)
      }
      if (slug2) {
        page = await getData({ slug: slug2, pub })
      }
    } else { // use pub key
      if (slug1) {
        if (!slug2) {
          page = await getData({ slug: slug1, pub })
        }
        if (slug2) {
          ;({ blog, pages } = await getData({ slug: slug1, pub }))
          injectHead(blog)
          page = await getData({ slug: slug2, pub })
        }
      }
    }
    isLoading = false
  })

  function injectHead (blog) {
    if (blog && blog.headerTag && !$isHeadTagUpdated) {
      const doc = document
        .createRange()
        .createContextualFragment(blog.headerTag)
      document.head.appendChild(doc)
      isHeadTagUpdated.update(() => true)
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
  <html lang="en" />
  <title>
    {blog ? `${blog.title}${page ? ' - ' : ''}` : ''}{page ? `${page.title}` : ''}
  </title>
  <meta name="description" content={page ? (page.description || page.content.substring(0, 160)) : ''} />
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
{:else}
  <div class="w-100 vh-100 flex items-center justify-center">
    <svg
      version="1.1"
      id="L4"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enable-background="new 0 0 0 0"
      xml:space="preserve">
      <circle fill="#9b9b9b" stroke="none" cx="6" cy="50" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.1" />
      </circle>
      <circle fill="#9b9b9b" stroke="none" cx="26" cy="50" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.2" />
      </circle>
      <circle fill="#9b9b9b" stroke="none" cx="46" cy="50" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.3" />
      </circle>
    </svg>
  </div>
{/if}
