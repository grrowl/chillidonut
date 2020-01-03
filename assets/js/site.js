function loadScript(url) {
  return new Promise(function(resolve, reject) {
    let element = document.createElement("script");
    element.src = url;
    element.async = true;

    element.onload = function() {
      resolve(url);
    };
    element.onerror = function() {
      reject(url);
    };

    onReady(function appendScript() {
      document.body.appendChild(element);
    })
  });
};


Promise.all([
  loadScript("https://unpkg.com/@swup/slide-theme@latest/dist/SwupSlideTheme.min.js"),
  loadScript("https://unpkg.com/@swup/ga-plugin@latest/dist/SwupGaPlugin.min.js"),
  loadScript("https://unpkg.com/@swup/scroll-plugin@latest/dist/SwupScrollPlugin.min.js"),
  loadScript("https://unpkg.com/swup@latest/dist/swup.min.js"),
]).then(function initTransitions () {
  const swup = new Swup({
    containers: ['section', 'article'],
    plugins: [
      new SwupSlideTheme({
        mainElement: 'article'
      }),
      new SwupGaPlugin(),
      new SwupScrollPlugin()
    ]
  });
})

;(function(f, a, t, h, o, m){
  a[h]=a[h]||function(){
    (a[h].q=a[h].q||[]).push(arguments)
  };
  o=f.createElement('script'),
  m=f.getElementsByTagName('script')[0];
  o.async=1; o.src=t; o.id='fathom-script';
m.parentNode.insertBefore(o,m)
})(document, window, '//visitors.chillidonut.com/tracker.js', 'fathom');
fathom('set', 'siteId', 'DFGPV');
fathom('trackPageview');