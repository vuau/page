import { gun } from './contexts'

export const getParentNode = (path, root) => {
  const parts = (path || '').split('_').filter(p => p !== '')
  let node = root.get('notes')
  parts.forEach(id => {
    node = node.get(id).get('children')
  })
  return node
}

export const getParentPath = path => {
  let parts = (path || '').split('_') // eslint-disable-line
  const id = parts.pop()
  const parentPath = parts.join('_')
  return [id, parentPath]
}

export const getNode = (path, root) => {
  const [id, parentPath] = getParentPath(path)
  return getParentNode(parentPath, root).get(id)
}

// return { blog, pages } if getting a folder, return {...page} otherwise
export async function getData ({ slug, pub }) {
  const user = gun.user(pub)
  const getPathFromSlugs = async slug => {
    return await user
      .get('slugs')
      .get(slug)
      .promOnce()
  }
  const path = await getPathFromSlugs(slug)
  const node = getNode(path.data, user)
  const nodeData = (await node.promOnce()).data

  if (nodeData.type === 'folder') {
    const children = node.get('children')
    const childKeys = Object.keys((await children.promOnce()).data).filter(
      key => key !== '_'
    )
    const pages = await Promise.all(
      childKeys.map(async key => (await children.get(key).promOnce()).data)
    )
    return { blog: nodeData, pages }
  }
  return { ...nodeData }
}
