// Strip attributes injected by browser extensions (Bitdefender, Grammarly, etc.)
// before React hydrates — otherwise Next.js shows "N 1 Issue" hydration badges.
(function () {
  if (typeof window === 'undefined') return

  var BAD_ATTRS = ['bis_skin_checked', 'bis_use', 'bis_register', 'cz-shortcut-listen']

  function isBad(name) {
    if (!name || typeof name !== 'string') return false
    var l = name.toLowerCase()
    return l.indexOf('bis_') === 0 || l.indexOf('cz-') === 0 || BAD_ATTRS.indexOf(l) !== -1
  }

  try {
    var origHas = Element.prototype.hasAttribute
    Element.prototype.hasAttribute = function (name) {
      if (isBad(name)) return false
      return origHas.call(this, name)
    }

    var origGet = Element.prototype.getAttribute
    Element.prototype.getAttribute = function (name) {
      if (isBad(name)) return null
      return origGet.call(this, name)
    }

    if (Element.prototype.getAttributeNames) {
      var origGetNames = Element.prototype.getAttributeNames
      Element.prototype.getAttributeNames = function () {
        return origGetNames.call(this).filter(function (n) {
          return !isBad(n)
        })
      }
    }

    var stripNode = function (node) {
      if (!node || node.nodeType !== 1) return
      var attrs = node.attributes
      if (!attrs) return
      for (var i = attrs.length - 1; i >= 0; i--) {
        var attr = attrs[i]
        if (attr && isBad(attr.name)) node.removeAttribute(attr.name)
      }
    }

    var stripTree = function (root) {
      if (!root) return
      stripNode(root)
      var all = root.querySelectorAll ? root.querySelectorAll('*') : []
      for (var i = 0; i < all.length; i++) stripNode(all[i])
    }

    if (document.documentElement) stripTree(document.documentElement)

    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var m = mutations[i]
        if (m.type === 'attributes' && isBad(m.attributeName)) {
          m.target.removeAttribute(m.attributeName)
        } else if (m.type === 'childList') {
          for (var j = 0; j < m.addedNodes.length; j++) stripTree(m.addedNodes[j])
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: BAD_ATTRS.concat(['bis_skin_checked']),
    })
  } catch (e) {
    // Fail open — never break the page for extension hygiene
  }
})()
