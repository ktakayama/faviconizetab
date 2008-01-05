/*
 * Copyright (c) 2006-2007, Kyosuke Takayama <support@mc.neweb.ne.jp>
 * It is released under the MIT LICENSE.
*/

faviconize.quickFav = {
   single: new Array('alt', 'ctrl', 'shift'),
   modkey: new Array(),

   init: function() {
      var io   = faviconize.IO.init();
      var self = faviconize.quickFav;

      self.modkey = new Array();

      for(var mKey, i = 0; mKey = self.single[i]; i++) {
         if(io.getBool('quick.'+mKey))
            self.modkey.push(mKey);
      }

      if(self.modkey.length > 0)
         gBrowser.mTabContainer.addEventListener('click', self.click, true);

      if(io.getBool('quick.dbl'))
         gBrowser.mTabContainer.addEventListener('dblclick', self.dblclick, true);
   },

   update: function() {
      gBrowser.mTabContainer.removeEventListener('click', this.click, true);
      gBrowser.mTabContainer.removeEventListener('dblclick', this.dblclick, true);
      this.init();
   },

   click: function(e) {
      if(e.button != 0 || e.target.localName != 'tab')
         return;

      var keys = faviconize.quickFav.modkey;
      for(var mKey, i = 0; mKey = keys[i]; i++) {
         if(e[mKey+'Key']) {
            faviconize.toggle(e.target);
            break;
         }
      }
   },

   dblclick: function(e) {
      if(e.button != 0 || e.target.localName != 'tab')
         return;

      faviconize.toggle(e.target);
   }
}

faviconize.addon.add(faviconize.quickFav);

