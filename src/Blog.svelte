<script>
  import { onMount } from 'svelte'
  import { gun } from './contexts.js'
  import { getNode } from './stores.js'

  export let slug1
  export let slug2
  export let pub

  let user, path, blog, pages, page, isLoading

  onMount(() => {
    isLoading = true
    user = gun.user(pub)
    user.get('slugs')
      .get(slug1)
      .on(v => {
        path = v
        if (path) {
          getData()
        }
      })
  })

  function getData () {
    getNode(path, user).on((node, id) => {
      console.log(node)
      if (!node) return
      if (node.type === 'folder') {
        blog = node
        pages = {}
        getNode(path, user).get('children').map().on((node, id) => {
          if (node && node.mode === 'public') {
            pages[id] = node
            console.log(node.slug, slug2)
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

{#if isLoading}
  Loading...
{:else}
  {#if slug2 && page}
    {@html page.content}
  {/if}
  {#if !slug2 && blog}
    <div>{blog.title} --- {path}</div>
    {#if pages}
      {#each Object.values(pages) as page}
        <div>
          <a href={`/${slug1}/${page.slug}/${pub}`}>{page.title}</a>
        </div>
      {/each}
    {/if}
  {/if}
  {#if !blog && !page}
    Not found!
  {/if}
{/if}
