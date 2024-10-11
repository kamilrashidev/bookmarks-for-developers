import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Kamilrashid.dev",
  description: "Bookmarks for Developers",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },  
    ],

    sidebar: [
      {
        text: '📦 Javascript',
        collapsed: false,
        items: [
          { text: 'General', link: '/md/javascript/' },
          { text: 'NPM', link: '/md/javascript/npm' },
          { text: 'React JS', link: '/md/javascript/reactjs' },
          { text: 'React Native', link: '/md/javascript/react-native' },
        ]
      },
      {
        text: '📦 Backend',
        collapsed: false,
        items: [
          { text: 'Database', link: '/md/backend/database' },
        ]
      },
      {
        text: '🧠 AI',
        link: '/md/ai'
      },
      {
        text: '💡 Knowledge',
        link: '/md/knowledge'
      },
      {
        text: '⏳ Productivity',
        link: '/md/productivity'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/kamilrashidev/bookmarks-for-developers' }
    ],
    search: {
      options: {
        miniSearch: {
          options: {
            tokenize: (text) => text.split(/[\n\r #%*,=/:;?[\]{}()&]+/u), // simplified charset: removed [-_.@] and non-english chars (diacritics etc.)
            processTerm: (term, fieldName) => {
              // biome-ignore lint/style/noParameterAssign: h
              term = term
                .trim()
                .toLowerCase()
                .replace(/^\.+/, '')
                .replace(/\.+$/, '')
              const stopWords = [
                'frontmatter',
                '$frontmatter.synopsis',
                'and',
                'about',
                'but',
                'now',
                'the',
                'with',
                'you'
              ]
              if (term.length < 2 || stopWords.includes(term)) return false
    
              if (fieldName === 'text') {
                const parts = term.split('.')
                if (parts.length > 1) {
                  const newTerms = [term, ...parts]
                    .filter((t) => t.length >= 2)
                    .filter((t) => !stopWords.includes(t))
                  return newTerms
                }
              }
              return term
            }
          },
          searchOptions: {
            combineWith: 'AND',
            fuzzy: true,
            // @ts-ignore
            boostDocument: (documentId, term, storedFields: Record) => {
              const titles = (storedFields?.titles as string[])
                .filter((t) => Boolean(t))
                .map((t) => t.toLowerCase())
              // Downrank posts
              if (documentId.match(/\/posts/)) return -5
              // Downrank /other
              if (documentId.match(/\/other/)) return -5
    
              // Uprate if term appears in titles. Add bonus for higher levels (i.e. lower index)
              const titleIndex =
                titles
                  .map((t, i) => (t?.includes(term) ? i : -1))
                  .find((i) => i >= 0) ?? -1
              if (titleIndex >= 0) return 10000 - titleIndex
    
              return 1
            }
          }
        },
        detailedView: true
      },
      provider: 'local'
    },
    lastUpdated: true,
    editLink: {
      pattern: 'https://github.com/kamilrashidev/bookmarks-for-developers/tree/main/:path',
      text: 'Edit this page on GitHub'
    },
    outline: 'deep'
  }
})
