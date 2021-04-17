import Gun from "gun";
import "gun/sea";
import "gun/lib/not";
import "gun/lib/then";
import "gun/lib/promise";

let peers;

if (process.env.NODE_ENV === "production") {
  peers = ["https://pensync.glitch.me/gun"];
} else {
  peers = ["http://localhost:8765/gun"];
}

export const gun = new Gun({ peers });

export const getParentNode = (path, root) => {
  const parts = (path || "").split("_").filter(p => p !== "");
  let node = root.get("notes");
  parts.forEach(id => {
    node = node.get(id).get("children");
  });
  return node;
};

export const getParentPath = path => {
  let parts = (path || "").split("_"); // eslint-disable-line
  const id = parts.pop();
  const parentPath = parts.join("_");
  return [id, parentPath];
};

export const getNode = (path, root) => {
  const [id, parentPath] = getParentPath(path);
  return getParentNode(parentPath, root).get(id);
};

export async function getData({ slug, pub }) {
  const user = gun.user(pub);
  const getPathFromSlugs = async slug => {
    return new Promise(resolve =>
      user
        .get("slugs")
        .get(slug)
        .on((v, k) => resolve(v))
    );
  };
  const path = await getPathFromSlugs(slug);
  const node = getNode(path, user);
  const nodeData = await new Promise(resolve =>
    node.on((v, k) => {
      if (v) resolve(v);
    })
  );

  if (nodeData.type === "folder") {
    const children = await new Promise(resolve =>
      node.get("children").on((v, k) => resolve(v))
    );
    const childKeys = Object.keys(children).filter(key => key !== "_");
    const pages = await Promise.all(
      childKeys.map(
        key =>
          new Promise(resolve =>
            node
              .get("children")
              .get(key)
              .on(v => {
                if (v) {
                  resolve(v);
                }
              })
          )
      )
    );
    return { ...nodeData, children: pages.filter(p => p.mode === "public") };
  }
  return { ...nodeData };
}
