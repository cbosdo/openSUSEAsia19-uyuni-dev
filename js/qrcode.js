Reveal.addEventListener( 'ready', function( event ) {
    /* Grab all links and iterate over them */
    var sources = document.getElementsByTagName('a');
    n = sources.length;
    for (var i = 0; i < n; i++) {
        var source = sources[i];
        var href = source.href;

        /* If the link has no href attribute, skip it */
        if (href) {
            var target_id = "qrcode-" + source.id ;
            var target = document.getElementById(target_id);
            /* If the source has no corresponding target element, skip
             * it */
            if (target) {
                var qr = new QRCode(target, {
                    colorDark : "#000000",
                    colorLight : "rgba(255,255,255,0)",
                });
                qr.makeCode(href);
            }
        }
    }
});
