import "./style.css";
import m from "mithril";
import { gun, getData } from "./utils";

m.route.prefix = "";

const domainMap = {
  'vuau.me': {
    pub:
      'J6ul10B2pvF1kr0ddHiEqtHbSsbzT06RtDQiJj90VhI.mQ5Ac2NgzzXGor_zgc0Hngl2-LVEN5frIhMju5r1HRc',
    slug: 'blog'
  },
  'test.localhost': {
    pub:
      'zoDnFx5dtl3OFPcsb84o7EU9jYY2OAaskZVo8pv5GFU.ZgpZ3rZo0QwsRYs6dGlXSs0y4-LNnD87_vvsXcsDTX8',
    slug: 'test'
  }
}

const Home = () => {
  let data, slug, pub, useDomain;

  const renderFolder = folder => {
    return [
      m("header", m("h1", folder.title)),
      folder.children.map(page =>
        m(
          "section",
          m(
            m.route.Link,
            { href: useDomain ? `/${page.slug}` : `/${page.slug}/${pub}` },
            page.title
          )
        )
      )
    ];
  };

  const renderFile = file => {
    return [
      m("header", m("h1", file.title)),
      m("section", m.trust(file.content))
    ];
  };

  const renderData = data => {
    if (data.type === "folder") {
      return renderFolder(data);
    }
    return renderFile(data);
  };

  return {
    oninit: () => {
      slug = m.route.param("key");
      pub = m.route.param("pub");
      if (!pub) {
        const domainInfo = domainMap[location.hostname];
        if (!domainInfo) {
          m.route.set('/404')
          return
        }
        pub = domainInfo.pub
        slug = slug || domainInfo.slug
        useDomain = true
      }
      getData({ slug, pub }).then(resp => {
        data = resp;
        m.redraw();
      });
    },
    view: () => {
      return m("main", !data ? "Loading..." : renderData(data));
    }
  };
};

const PageNotFound = () => {
  return {
    view: () => m('div', 'Page Not Found')
  };
}

m.route(document.body, "/", {
  "/:key/:pub": Home,
  "/404": PageNotFound,
  "/:key": Home,
  "/": Home
});
