<script>
  import { navigate } from 'svelte-routing'
  import { onMount } from 'svelte'
  import { gun } from './contexts.js'
  import { getNode } from './stores.js'
  export let slug1
  export let slug2
  export let pub

  let user, path, blog, pages, page, isLoading, isDoneAppend
  onMount(() => {
    isLoading = true
    user = gun.user(pub)
    user
      .get('slugs')
      .get(slug1)
      .on(v => {
        path = v
        if (path) {
          getData()
        }
      })
  })
  function clickPage (href) {
    navigate(href)
    window.scrollTo(0, 0)
  }
  function getBlogURL () {
    return `/${slug1}/${pub}`
  }
  function getPageURL (slug) {
    return `/${slug1}/${slug}/${pub}`
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
              if (node.slug === slug2) {
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
          on:click|preventDefault={() => clickPage(getBlogURL())}
          class="link"
          href={getBlogURL()}>
          {blog.title}
        </a>
      </h1>
    {:else if page && page.title}
      <h1 class="baskerville fw1 ph3 ph0-l pv2">{page.title}</h1>
    {/if}

    {#if slug2 && page}
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
    {#if !blog && !page}Not found!{/if}
  {/if}
  <footer class="pv4 bt b--black-10 black-70">
    <p class="f6 db b lh-solid">
      © Powered by
      <a class="link" href="https://github.com/vuau/pen">Pen</a>
    </p>
  </footer>
</section>
