<script>
  import { onMount } from 'svelte'
  import { gun } from './contexts.js'
  import { getNode } from './stores.js'

  export let slug1
  export let slug2
  export let pub

  let user, path, blog, pages

  onMount(() => {
    user = gun.user(pub)
    user.get('slugs')
      .get(slug1)
      .once(v => {
        path = v
        getData()
      })
  })
  function getData () {
    getNode(path, user).once((node, id) => {
      console.log(node)
      if (!node) return
      blog = node
      blog = blog
      pages = []
      getNode(path, user).get('children').map().once(node => {
        console.log('vo', node)
        pages.push(node)
        pages = pages
      })
    })
  }
</script>

{#if blog}
  <div>{blog.title} --- {path}</div>
  {#if pages}
    {#each pages as page}
      <div>{page.title}</div>
    {/each}
  {/if}
{/if}
