<script>
  import { Router, Route } from 'svelte-routing'
  import Blog from './Blog.svelte'
</script>

<Router>
  <Route path=":slug1/:slug2" component={Blog} />
  <Route path=":slug1" component={Blog} />
  <Route path="/" component={Blog} />
</Router>
