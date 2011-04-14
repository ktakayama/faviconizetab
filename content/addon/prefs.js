/*
 * Copyright (c) 2006-2011, Kyosuke Takayama <loiseau@gmail.com>
 * It is released under the MIT LICENSE.
*/

if(typeof faviconize == 'undefined')
   var faviconize = {};

faviconize.prefManager = {
   keys: new Array('quick.alt', 'quick.ctrl', 'quick.shift', 'quick.dbl', 'auto.enable', 'misc.nothide'),

   initPrefs: function() {
      var io = faviconize.IO.init();
      var $  = this.$;

      for(var key, i = 0; key = this.keys[i]; i++) {
         if(io.getBool(key))
            $(key).checked = true;
      }

      $('auto.includes').value = io.getChar('auto.includes');

      if($('auto.enable').checked)
         this.toggleTextbox('auto.includes');
   },

   setPrefs: function() {
      var io = faviconize.IO.init();
      var $  = this.$;

      for(var key, i = 0; key = this.keys[i]; i++) {
         var bool = $(key).checked;
         io.setBool(key, bool);
      }

      io.setChar('auto.includes', $('auto.includes').value);

      var win= Components.classes["@mozilla.org/appshell/window-mediator;1"].
         getService(Components.interfaces.nsIWindowMediator).getEnumerator("navigator:browser");

      while(win.hasMoreElements()) {
         var browser = win.getNext();
         browser.faviconize.addon.update();
      }
   },

   toggleTextbox: function(box) {
      var self = faviconize.prefManager;
      self.$(box).disabled = !self.$(box).disabled;
   },

   $: function(e) {
      return document.getElementById(e);
   }
}

