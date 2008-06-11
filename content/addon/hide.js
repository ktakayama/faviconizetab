/*
 * Copyright (c) 2008, Kyosuke Takayama <support@mc.neweb.ne.jp>
 * It is released under the MIT LICENSE.
*/

faviconize.hideBtn = {
   init: function() {
      var io   = faviconize.IO.init();
      var self = faviconize.hideBtn;

      if(io.getBool('hide.disable')) return;
      gBrowser.tabContainer.setAttribute('favhideclose', true);
   },

   update: function() {
      gBrowser.tabContainer.removeAttribute('favhideclose');
      this.init();
   }
}

faviconize.addon.add(faviconize.hideBtn);

