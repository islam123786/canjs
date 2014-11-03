var assert = require("assert"),
	Browser = require("zombie"),
	connect = require("connect"),
	stealTools = require("steal-tools"),
	path = require("path"),
	rmdir = require("rimraf");

// Helpers
var find = function(browser, property, callback, done){
	var start = new Date();
	var check = function(){
		if(browser.window && browser.window[property]) {
			callback(browser.window[property]);
		} else if(new Date() - start < 2000){
			setTimeout(check, 20);
		} else {
			done("failed to find "+property+" in "+browser.window.location.href);
		}
	};
	check();
};

var open = function(url, callback, done){
	var server = connect().use(connect.static(path.join(__dirname,"../../.."))).listen(8081);
	var browser = Browser.create();
	browser.visit("http://localhost:8081/"+url)
		.then(function(){
			callback(browser, function(err){
				server.close();
				done(err);
			})
		}).catch(function(e){
			server.close();
			done(e)
		});
};

describe("Building steal projects", function(){

	it("works with ejs, mustache, and stache", function(done){
			rmdir(__dirname+"/bundles", function(error){
				if(error){
					done(error)
				}
				// build the project that 
				// uses a plugin
				stealTools.build({
					config: __dirname+"/config.js",
					main: "app"
				}, {
					minify: false,
					quiet: true
				}).then(function(){
					open("test/builders/steal-tools/prod.html", function(browser, close) {
						find(browser, "MODULE", function(m){
							assert.equal(m.ejs.childNodes[0].textContent, "EJS Hi", "EJS generated correctly");
							assert.equal(m.mustache.childNodes[0].textContent, "Mustache Hi", "Mustache generated correctly");
							assert.equal(m.stache.childNodes[0].textContent, "Stache Hi", "Stache generated correctly");
							done();
						}, close);
					}, done);
				}).catch(done);
			});
	});

});