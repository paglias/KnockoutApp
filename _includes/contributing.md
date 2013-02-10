<h1 class="page-header">Contributing</h1>

KnockoutApp uses [Grunt](https://github.com/gruntjs/grunt/tree/0.3-stable) for building and docco to generate annotated-source-code.

It uses version `0.4` of Grunt which is still unreleased but quite stable.

[Here](https://github.com/gruntjs/grunt/wiki/Upgrading-from-0.3-to-0.4) there's the migration guide from Grunt 0.3 to 0.4, read it carefully because there are several breaking changes.

To build it:

1. Download source from github
2. Open the terminal in the directory where you have downloaded the code
3. Install dependencies with <pre class="prettyprint">npm install</pre> (remember to install `grunt-cli` globally before, see the migration guide for Grunt 0.4 linked above)

Now you can run:

<ul>
 <li><pre class="prettyprint">grunt build</pre> to build KnockoutApp into /build</li>
 <li><pre class="prettyprint">grunt test</pre> to run tests</li>
 <li><pre class="prettyprint">grunt run</pre> to start a webserver at http://localhost:8000 and rebuild/test every time a file change</li>
 <li><pre class="prettyprint">grunt connect:server:keepalive</pre> to start a webserver at http://localhost:8000 but don't rebuild/test anything</li>
 <li><pre class="prettyprint">grunt publish</pre> which I use to publish a new version of KnockoutApp</li>
</ul>

On github the development happens on the `master` branch, so if you want to send some code send it there!