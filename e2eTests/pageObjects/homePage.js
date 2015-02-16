MainPage = function() {
	this.get = function() {
		browser.get('/');
	};

	this.view = element(by.css('.main-view'));
};

module.exports = MainPage;