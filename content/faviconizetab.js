/*
 * Copyright (c) 2006-2007, Kyosuke Takayama <support@mc.neweb.ne.jp>

 * It is released under the MIT LICENSE.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.jp/licenses/mit-license.html
*/

var faviconize = {
   toggle: function(tab) {
      if(!tab || tab.localName != 'tab')
         tab = gBrowser.mCurrentTab;

      var session = this.session;

      if(tab.hasAttribute('faviconized')) {
         tab.removeAttribute('faviconized');
         tab.minWidth = tab._oldMinWidth;
         tab.maxWidth = tab._oldMaxWidth;
         if(session) session.deleteTabValue(tab, 'faviconized');
      } else {
         tab._oldMinWidth = tab.minWidth || gBrowser.mTabContainer.mTabMinWidth;
         tab._oldMaxWidth = tab.maxWidth || 250;

         tab.setAttribute('faviconized', true);
         tab.minWidth  = '';
         tab.maxWidth  = '';

         if(session) session.setTabValue(tab, 'faviconized', true);
      }
   },

   restore: function(e) {
      var tab = e.originalTarget;
      if(faviconize.session.getTabValue(tab, 'faviconized'))
         faviconize.toggle(tab);
   }
}

faviconize.ui = {
   btn: {},

   init: function() {
      if(document.getElementById('tabContextFaviconizeTab')) return;
      var self = faviconize.ui;

      var toggle = document.createElement('menuitem');
      toggle.setAttribute('type', 'checkbox');
      toggle.setAttribute('id', 'tabContextFaviconizeTab');
      toggle.setAttribute('label', 'FaviconizeTab');
      toggle.setAttribute('oncommand', 'faviconize.toggle(gBrowser.mContextTab);');
      toggle.setAttribute('accesskey', 'f');
      self.btn.toggle = toggle;

      var menu = gBrowser.mStrip.firstChild.nextSibling;
      menu.insertBefore(toggle, menu.lastChild.previousSibling);
      menu.addEventListener('popupshown', self.popup, false);

      if(typeof Cc != 'undefined') {
         faviconize.session = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
         window.addEventListener('SSTabRestoring', faviconize.restore, false);
      }
   },

   popup: function() {
      var target = gBrowser.mContextTab;
      var tab = (target.localName == 'tabs') ? gBrowser.mCurrentTab : target;
      faviconize.ui.btn.toggle.setAttribute('checked', tab.hasAttribute('faviconized'));
   }
}

faviconize.override = {
   init: function() {
      var self = faviconize.override;
      for(var i in self) {
         if(i == 'init') continue;
         self[i]();
      }
   },

   adjustTabstrip: function() {
      eval('gBrowser.mTabContainer.adjustTabstrip = ' +
            gBrowser.mTabContainer.adjustTabstrip.toString().replace(
               'var width = this.firstChild.boxObject.width;',
               'var width = this.firstChild.boxObject.width;'+
               'for(var tab, i = 0;tab = this.childNodes[i];i++) {'+
               '  if(!tab.hasAttribute("faviconized")) {'+
               '     width = tab.boxObject.width;'+
               '     break;'+
               '  }'+
               '}'
               )
            );
   }
}

window.addEventListener('load', faviconize.ui.init, false);
window.addEventListener('load', faviconize.override.init, false);

