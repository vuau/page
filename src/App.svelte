<script>
  import { Router, Route } from 'svelte-routing'
  import Blog from './Blog.svelte'
</script>

<Router>
  <Route path=":slug1/:slug2/:pub" component={Blog} />
  <Route path=":slug1/:pub" component={Blog} />
  <Route path=":slug2" component={Blog} />
  <Route path="/" component={Blog} />
</Router>
