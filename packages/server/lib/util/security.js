// Tests located in packages/server/test/unit/security_spec

/* eslint-disable
    no-unused-vars,
*/
const stream = require('stream')
const pumpify = require('pumpify')
const replacestream = require('replacestream')

const topOrParentEqualityBeforeRe = /((?:window|self)(?:\.|\[['"](?:top|self)['"]\])?\s*[!=]==?\s*(?:(?:window|self)(?:\.|\[['"]))?)(top(?![\w])|parent(?![\w]))/g
const topOrParentEqualityAfterRe = /(top|parent)((?:["']\])?\s*[!=]==?\s*(?:window|self))/g
const topOrParentLocationOrFramesRe = /([^\da-zA-Z\(\)])?(top|parent)([.])(location|frames)/g
const jiraTopWindowGetterRe = /(!function\s*\((\w{1})\)\s*{\s*return\s*\w{1}\s*(?:={2,})\s*\w{1}\.parent)(\s*}\(\w{1}\))/g

const strip = (html) => {
  return html
  .replace(topOrParentEqualityBeforeRe, '$1self')
  .replace(topOrParentEqualityAfterRe, 'self$2')
  .replace(topOrParentLocationOrFramesRe, '$1self$3$4')
  .replace(jiraTopWindowGetterRe, '$1 || $2.parent.__Cypress__$3')
}

const stripStream = () => {
  return pumpify(
    replacestream(topOrParentEqualityBeforeRe, '$1self'),
    replacestream(topOrParentEqualityAfterRe, 'self$2'),
    replacestream(topOrParentLocationOrFramesRe, '$1self$3$4'),
    replacestream(jiraTopWindowGetterRe, '$1 || $2.parent.__Cypress__$3')
  )
}

module.exports = {
  strip,

  stripStream,
}
