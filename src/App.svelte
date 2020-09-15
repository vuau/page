<script>
  import { Router, Route } from 'svelte-routing'
  import Blog from './Blog.svelte'
  import BlogWithDomain from './BlogWithDomain.svelte'
</script>

<Router>
  <Route path=":slug1/:slug2/:pub" component={Blog} />
  <Route path=":slug1/:pub" component={Blog} />
  <Route path=":slug" component={BlogWithDomain} />
  <Route path="/" component={BlogWithDomain} />
</Router>
