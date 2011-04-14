/*
 * Copyright (c) 2006-2011, Kyosuke Takayama <loiseau@gmail.com>
 * It is released under the MIT LICENSE.
*/

faviconize.addon = {
   lists: new Array(),

   init: function() {
      for(var list, i = 0; list = faviconize.addon.lists[i]; i++)
         list.init();
   },

   add: function(l) {
      this.lists.push(l);
   },

   update: function() {
      for(var list, i = 0; list = this.lists[i]; i++)
         list.update();
   }
}

faviconize.IO = {
   pref: null,

   init: function() {
      this.pref = Components.classes["@mozilla.org/preferences-service;1"].
         getService(Components.interfaces.nsIPrefService).getBranch('extensions.faviconizetab.');
      return this;
   },

   getBool: function(key) {
      try {
         return this.pref.getBoolPref(key);
      } catch(e) {
         return false;
      }
   },

   setBool: function(key, val) {
      return this.pref.setBoolPref(key, val);
   },

   getChar: function(key) {
      try {
         return this.pref.getCharPref(key);
      } catch(e) {
         return '';
      }
   },

   setChar: function(key, val) {
      return this.pref.setCharPref(key, val);
   },

   getLists: function(key) {
      return this.getChar(key).replace(/\n/, ' ').split(/\s+/);
   }
}

window.addEventListener('load', faviconize.addon.init, false);

