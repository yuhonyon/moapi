
const mockSnippets = require('./mock.snippers')
ace.define('ace/snippets/json', ['require', 'exports', 'module'], function (e, t) {
  t.snippetText = mockSnippets
  t.scope = 'json'
})
