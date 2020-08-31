<script>
  import { onMount } from 'svelte'
  import qs from 'qs'
  import { querystring } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
  import { gun } from './contexts.js'
  import { getNode } from './stores.js'

  export let params = {}

  let blog
  let page
  let pubParam
  let user
  let msg

  onMount(() => {
    const { pub } = qs.parse($querystring)
    if (location.hostname === 'localhost' && !pub) {
      msg = 'cannot load'
    } else {
      pubParam = pub
      user = gun.user(pub)
    }
  })

  $: fetchNote(params, user)

  function fetchNote (params, user) {
    if (!user) return
    const { slug1, slug2 } = params
    user
      .get('slugs')
      .get(slug1)
      .on(pathFromSlug => {
        getNode(pathFromSlug, user).on(node => {
          blog = {
            title: node.title
          }
          if (node.type === 'folder') {
            // load list of files
            page = null
            getNode(pathFromSlug, user)
              .get('children')
              .map()
              .on((pageNode, id) => {
                if (pageNode.mode === 'public' && pageNode.slug) {
                  blog[id] = pageNode
                  if (slug2 && pageNode.slug === slug2) {
                    page = pageNode
                  }
                }
              })
          } else {
            // load file
            blog = null
            console.log('blog null')
            getNode(pathFromSlug, user).on(pageNode => {
              page = pageNode
            })
          }
        })
      })
  }
</script>

{#if msg && (!blog && !page)}{msg}{/if}

<section class="mw7 center avenir">
  {#if blog && blog.title}
    <h1 class="f3 f1-m f-headline-l">
      <a class="link" href={`#/${params.slug1}?pub=${pubParam}`}>{blog.title}</a>
    </h1>
  {:else if page && page.title}
    <h1 class="baskerville fw1 ph3 ph0-l">{page.title}</h1>
  {/if}

  {#if page && page.content}
    {#if params.slug1 && params.slug2}
      <h2 class="f3 f2-m f-subheadline-l measure lh-title fw1 mt0">{page.title}</h2>
    {/if}
    <article>
      {@html page.content}
    </article>
  {/if}
  {#if blog && !page}
    {#each Object.entries(blog) as [id, { title, content, slug }]}
      {#if id !== 'title'}
        <article class="bt b--black-10">
          <a
            class="db pv4 ph3 ph0-l no-underline black dim"
            use:active={`/${params.slug1}/${slug}(.*)`}
            href={`#/${params.slug1}/${slug}?pub=${pubParam}`}>
            <div class="flex flex-column flex-row-ns">
              <h1 class="f3 fw1 baskerville mt0 lh-title">{title}</h1>
            </div>
          </a>
        </article>
      {/if}
    {/each}
  {/if}
</section>
