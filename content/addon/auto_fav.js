/*
 * Copyright (c) 2006-2011, Kyosuke Takayama <loiseau@gmail.com>
 * It is released under the MIT LICENSE.
*/

faviconize.autoFav = {
   urls: new Array(),
   _reptxt: 'faviconize.autoFav.loaded(aTab);',

   init: function() {
      var io   = faviconize.IO.init();
      var self = faviconize.autoFav;

      self.urls = new Array();

      if(!io.getBool('auto.enable')) return;

      var lists = io.getLists('auto.includes');

      lists.forEach(function(v) {
         if(v=='') return;
         v = v.replace(/([\.\\\*\[\]\(\)\+])/g, '\\$1');
         v = v.replace(/(\\\*)/g, '.*');
         self.urls.push(RegExp('^'+v+'$'));
      });

      if(self.urls.length > 0) {
         eval('gBrowser.setIcon = ' + gBrowser.setIcon.toString().replace(
            'var', self._reptxt+'var'));
      }
   },

   update: function() {
      eval('gBrowser.setIcon = ' + gBrowser.setIcon.toString().replace(this._reptxt, ''));
      this.init();
   },

   check: function(url) {
      var lists = faviconize.autoFav.urls;
      for(var v, i = 0;v = lists[i];i++)
         if(v.test(url)) return true;
      return false;
   },

   loaded: function(tab) {
      if(tab.hasAttribute('faviconized')) return;
      if(!faviconize.autoFav.check(tab.linkedBrowser.currentURI.spec)) return;
      faviconize.toggle(tab);
   }
}

faviconize.addon.add(faviconize.autoFav);

