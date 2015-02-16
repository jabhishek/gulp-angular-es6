describe("MainController", function () {

	var MainCtrl, $controller;

	beforeEach(module('angularApp'));

	beforeEach(inject(function (_$controller_) {
		$controller = _$controller_;
	}));

	it('should be defined', function () {
		MainCtrl = $controller('MainController');
		expect(MainCtrl).toBeDefined();
	});
});

