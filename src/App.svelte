<script>
  import Router from 'svelte-spa-router'
  import Blog from './Blog.svelte'
  const routes = {
    '/:slug1/:slug2': Blog,
    '/:slug1': Blog,
    '/': Blog
  }
</script>

<Router {routes} />
