Subport
=======

A combo submission/reporting module for Garrit.

Installation
------------

Subport is built on a PHP backend and provides a JavaScript-based frontend.
To get rolling, the deployment environment will need:

* [Bower](http://bower.io/)
* Apache 2.(2|4) with...
    * [`mod_rewrite`](http://httpd.apache.org/docs/2.2/mod/mod_rewrite.html)
    * PHP 5.6
    * `MultiViews` disabled
    * `AllowOverride` permitting `FileInfo` for the deployment directory

With that out of the way...

1. Clone the repository into the deployment directory.
2. Run `bower install` from within the directory to grab frontend dependencies.
3. Edit `backend/.htaccess` and update the `RewriteBase` to reflect the
   relative URL at which the `backend` directory is accessible. For example, if
   the `backend` directory is accessible at
   `http://example.com/some/path/backend`, set `RewriteBase` to
   `/some/path/backend` (no trailing slash).

Assuming your environment meets the requirements (no pesky Multiviews!),
Subport should be ready to rumble.