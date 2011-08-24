/*
 * Copyright (c) 2006-2011, Kyosuke Takayama <loiseau@gmail.com>

 * It is released under the MIT LICENSE.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.jp/licenses/mit-license.html
*/

var faviconize = {
   toggle: function(tab) {
      if(!tab || tab.localName != 'tab')
         tab = gBrowser.mCurrentTab;

      if(tab.hasAttribute('faviconized')) {
         this.disable(tab);
      } else {
         this.enable(tab);
      }
   },

   enable: function(tab) {
      tab._oldMinWidth = tab.minWidth || gBrowser.mTabContainer.mTabMinWidth;
      tab._oldMaxWidth = tab.maxWidth || 250;

      tab.setAttribute('faviconized', true);
      tab.minWidth  = '';
      tab.maxWidth  = '';

      if(this.session) this.session.setTabValue(tab, 'faviconized', true);
   },

   disable: function(tab) {
      tab.removeAttribute('faviconized');
      if(tab._oldMinWidth) tab.minWidth = tab._oldMinWidth;
      if(tab._oldMaxWidth) tab.maxWidth = tab._oldMaxWidth;
      if(this.session) this.session.setTabValue(tab, 'faviconized', '');
   },

   restore: function(e) {
      var tab = e.originalTarget;
      if(faviconize.session.getTabValue(tab, 'faviconized'))
         faviconize.enable(tab);
      else if(tab.hasAttribute('faviconized'))
         faviconize.disable(tab);
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
   }
}

faviconize.override._lockTabSizing = function() {
   faviconize.o_lockTabSizing = gBrowser.mTabContainer._lockTabSizing;

   gBrowser.mTabContainer._lockTabSizing = function(aTab) {
      if(aTab.hasAttribute('faviconized')) {
         gBrowser.mTabContainer._unlockTabSizing();
         return;
      }

      faviconize.o_lockTabSizing.apply(this, arguments);

      var tabs = this.tabbrowser.visibleTabs;
      if(!tabs.length) return;
      for(let i = 0; i < tabs.length; i++) {
         let tab = tabs[i];
         if(tab.hasAttribute('faviconized')) {
            tab.style.MozTransition = "none";
            tab.style.maxWidth = "";
         }
      }
   }
}

window.addEventListener('load', faviconize.ui.init, false);
window.addEventListener('load', faviconize.override.init, false);

if(typeof Cc != 'undefined') {
   faviconize.session = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);
   window.addEventListener('SSTabRestoring', faviconize.restore, false);
}

