/*
 * Copyright (c) 2008-2011, Kyosuke Takayama <loiseau@gmail.com>
 * It is released under the MIT LICENSE.
*/

faviconize.miscFav = {
   init: function() {
      var io   = faviconize.IO.init();
      if(io.getBool('misc.nothide')) return;
      gBrowser.tabContainer.setAttribute('favhideclose', true);
   },

   update: function() {
      gBrowser.tabContainer.removeAttribute('favhideclose');
      this.init();
   }
}

faviconize.override.adjustTabstrip = function() {
   faviconize.o_adjustTabstrip = gBrowser.mTabContainer.adjustTabstrip;

   gBrowser.mTabContainer.adjustTabstrip = function() {
      if(this.mCloseButtons != 1 || this.childNodes.length == 1)
         return faviconize.o_adjustTabstrip.apply(this, arguments);

      var io = faviconize.IO.init();
      var width, clipWidth;
      if(io.getBool('misc.nothide')) {
         width = this.mTabstrip.boxObject.width - this.mTabClipWidth;
         clipWidth = 0;

         for(var tab, i = 0;tab = this.tabbrowser.visibleTabs[i];i++) {
            if(tab.hasAttribute("faviconized")) {
               clipWidth += 52;
            } else {
               clipWidth += tab.getBoundingClientRect().width;
            }
         }
      } else {
         clipWidth = this.mTabClipWidth;
         for(let tab, i = this.tabbrowser._numPinnedTabs;tab = this.tabbrowser.visibleTabs[i];i++) {
            if(!tab.hasAttribute("faviconized")) {
               width = tab.getBoundingClientRect().width;
               break;
            }
         }
      }

      if(width > clipWidth) this.setAttribute("closebuttons", "alltabs");
      else this.setAttribute("closebuttons", "activetab");

      var tabstripClosebutton = document.getElementById("tabs-closebutton");
      if(tabstripClosebutton && tabstripClosebutton.parentNode == this._container)
         tabstripClosebutton.collapsed = this.mCloseButtons != 3;
   }
}

faviconize.addon.add(faviconize.miscFav);

