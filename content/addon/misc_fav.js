/*
 * Copyright (c) 2008, Kyosuke Takayama <support@mc.neweb.ne.jp>
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

faviconize.addon.add(faviconize.miscFav);

