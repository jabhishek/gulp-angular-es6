describe('app', function () {

	var mainPageObject = require("./pageObjects/homePage");
	var mainPage = new mainPageObject();

	var ptor;
	beforeEach(function () {
		"use strict";
	/*	ptor = protractor.getInstance();
		ptor.manage().deleteAllCookies();*/
	});

	it('should load the home page', function () {
		mainPage.get();
		expect(browser.getLocationAbsUrl()).toBe('/');
	});

	it('should have a ui-view', function () {
		mainPage.get();
		expect(mainPage.view.isPresent()).toBeTruthy();
	});
});