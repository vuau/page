import { gunUser } from './contexts'

export const getParentNode = (path, root = gunUser) => {
  const parts = (path || '').split('_').filter(p => p !== '')
  let node = root.get('notes')
  parts.forEach(id => {
    node = node.get(id).get('children')
  })
  return node
}

export const getParentPath = (path) => {
  let parts = (path || '').split('_') // eslint-disable-line
  const id = parts.pop()
  const parentPath = parts.join('_')
  return [id, parentPath]
}

export const getNode = (path, root = gunUser) => {
  const [id, parentPath] = getParentPath(path)
  return getParentNode(parentPath, root).get(id)
}
