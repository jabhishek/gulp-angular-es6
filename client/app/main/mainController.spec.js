describe("MainController", function () {

	var MainCtrl, $controller;

	beforeEach(module('angularApp'));

	beforeEach(inject(function (_$controller_) {
		$controller = _$controller_;
	}));

	it('showAdminView should be true if admin logged in', function () {
		MainCtrl = $controller('MainController');
		expect(MainCtrl).toBeDefined();
	});
});

