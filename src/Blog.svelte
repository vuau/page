<script>
  import qs from 'qs'
  import { querystring } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
  import { gun } from './contexts.js'
  import { getNode } from './stores.js'

  export let params = {}

  let blog
  let page

  let info = {}
  let user
  let msg

  const isProd = process.env.NODE_ENV === 'production'
  const hasCustomDomain =
    location.hostname !== 'localhost' && location.hostname !== 'nicepage.now.sh'

  const domainPub = isProd
    ? 'UUvt2FxUhDgixqNwjoDVo6g0HBZ5aoxYnrilZrQeG-c.V43xuAgfPrijpatwhdPIEVqhORsfOtpnE_QhrubF5bw'
    : 'knekjvdWMF1vqCkF4kD99R22HKXP5zjxA-DeM4BBIX0.liPyrUDutaxA8UVxaC45a6c_EfXfrN2UXna_7MrCip0'

  function getBlogURL () {
    if (hasCustomDomain) {
      return '#/'
    }
    return `#/${info.slug1}?pub=${info.pub}`
  }

  function getPageURL (slug) {
    if (hasCustomDomain) {
      return `#/${slug}`
    }
    return `#/${info.slug1}/${slug}?pub=${info.pub}`
  }

  $: fetchNote(params)

  async function fetchNote (params) {
    if (hasCustomDomain) {
      const domainUser = gun.user(domainPub)
      const hostname = location.hostname
      const domainInfo = await domainUser.get(hostname).then()
      if (!domainInfo) {
        msg = 'cannot load'
        return
      }
      info = {
        pub: domainInfo.pub,
        slug1: domainInfo.slug,
        slug2: params.slug1
      }
    } else {
      const { pub } = qs.parse($querystring)
      if (!pub) {
        msg = 'cannot load'
        return
      }
      info = {
        pub,
        slug1: params.slug1,
        slug2: params.slug2
      }
    }

    user = gun.user(info.pub)

    if (!user) return

    const { slug1, slug2 } = info
    const pathFromSlug = await user.get('slugs').get(slug1).then()
    const node = await getNode(pathFromSlug, user).then()

    if (!node) return

    blog = {
      title: node.title,
      headerTag: node.headerTag
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
      getNode(pathFromSlug, user).on(pageNode => {
        page = pageNode
      })
    }
  }
</script>

{#if msg && !blog && !page}{msg}{/if}

<svelte:head>
  {#if blog && !page}
   {@html blog.headerTag}
  {/if}
</svelte:head>

<section class="mw8 pa3 center avenir">
  {#if blog && blog.title}
    <h1 class="f2 f1-m f-headline-l pv2">
      <a class="link" href={getBlogURL()}>{blog.title}</a>
    </h1>
  {:else if page && page.title}
    <h1 class="baskerville fw1 ph3 ph0-l pv2">{page.title}</h1>
  {/if}

  {#if page && page.content}
    {#if info.slug1 && info.slug2}
      <h2 class="f2 f2-m f-subheadline-l measure lh-title fw1 mt0 pb2">
        {page.title}
      </h2>
    {/if}
    <article>
      {@html page.content}
    </article>
  {/if}
  {#if blog && !page}
    {#each Object.entries(blog) as [id, { title, content, slug }]}
      {#if !['title', 'headerTag'].includes(id)}
        <article class="bt b--black-10">
          <a
            class="db pv3 pv4-ns no-underline black dim"
            use:active={`/${info.slug1}/${slug}(.*)`}
            href={getPageURL(slug)}>
            <div class="flex flex-column flex-row-ns">
              <h1 class="f3 fw1 baskerville mt0 lh-title">{title}</h1>
            </div>
          </a>
        </article>
      {/if}
    {/each}
  {/if}
  <footer class="pv4 bt b--black-10 black-70">
    <p class="f6 db b lh-solid">© Powered by <a class="link" href="https://github.com/vuau/pen">Pen</a></p>
  </footer>
</section>
