<h1 class="page-header">Getting started</h1>
Just include the file in you're html page and you're ready:

<pre class="prettypint">
&lt;script type="text/javascript" src="knockout.app.min.js"&gt;&lt;/script&gt;
</pre>

It is also avalaible as an **AMD** and **CommonJS** module.
<br/><br/>
While it won't work server-side KnockoutApp is avalaible as an **npm module**, it is intended for use with [Browserify](https://github.com/substack/node-browserify) or similar tools:

<pre class="prettypint">
npm install knockout.app
</pre>

<br>
The only dependency is KnockoutJS while jQuery is only necessary when using Knockout.Sync for ajax calls.