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

faviconize.override = {
   adjustTabstrip: function() {
      var _o = gBrowser.mTabContainer.adjustTabstrip;
      gBrowser.mTabContainer.adjustTabstrip = function() {
         var io = faviconize.IO.init();
         if(!io.getBool('misc.nothide') || this.mCloseButtons != 1 || this.childNodes.length == 1)
            return _o.apply(this, arguments);

         var scrollWidth = this.mTabstrip.boxObject.width - this.mTabClipWidth;
         var clipWidth = 0;

         for(var tab, i = 0;tab = this.tabbrowser.visibleTabs[i];i++) {
            if(tab.hasAttribute("faviconized")) {
               clipWidth += 52;
            } else {
               clipWidth += tab.getBoundingClientRect().width;
            }
         }

         if(scrollWidth > clipWidth) this.setAttribute("closebuttons", "alltabs");
         else this.setAttribute("closebuttons", "activetab");

         var tabstripClosebutton = document.getElementById("tabs-closebutton");
         if(tabstripClosebutton && tabstripClosebutton.parentNode == this._container)
            tabstripClosebutton.collapsed = this.mCloseButtons != 3;
      }
   }
}

faviconize.addon.add(faviconize.miscFav);

