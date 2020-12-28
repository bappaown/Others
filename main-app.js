/// <reference path="E:\Debdut\Latest Projects\SPAREPARTS WEB\Client\PartsClient\PartsClient\scripts/jquery-1.10.2.min.js" />
/// <reference path="E:\Debdut\Latest Projects\SPAREPARTS WEB\Client\PartsClient\PartsClient\scripts/zebra_dialog.js" />
/// <reference path="E:\Debdut\Latest Projects\SPAREPARTS WEB\Client\PartsClient\PartsClient\scripts/angular.min.js" />
/// <reference path="E:\Debdut\Latest Projects\SPAREPARTS WEB\Client\PartsClient\PartsClient\scripts/loading-bar.min.js" />


var myApp = angular.module('spareparts', ['ngRoute', 'angular-loading-bar', 'cfp.loadingBarInterceptor', 'angular-linq'])
            .run(function ($rootScope) {
                $rootScope.IsAuthenticated = angular.fromJson(sessionStorage.user) != null ? true : false;
                if ($rootScope.IsAuthenticated == false) {
                    $rootScope.SiteMenus = [];
                    $rootScope.userName = null;
                }
                else {
                    $rootScope.SiteMenus = angular.fromJson(sessionStorage.menues);
                    $rootScope.userName = angular.fromJson(sessionStorage.UrerName);
                }
            })
            .config(['$routeProvider', '$locationProvider', 'cfpLoadingBarProvider', function ($routeProvider, $locationProvider, cfpLoadingBarProvider) {
                cfpLoadingBarProvider.includeSpinner = false;
                $routeProvider.caseInsensitiveMatch = true;

                $routeProvider
                .when('/',
                {
                    redirectTo: '/home'
                })
                .when('/home',
                {
                    templateUrl: '/templates/home.html',
                    controller: 'homeController'
                })
                .when('/login',
                {
                    templateUrl: '/templates/login.html',
                    //templateUrl:'/templates/OTPLogin.html',
                    controller: 'loginController'
                })
                .when('/co',
                {
                    templateUrl: '/templates/Company.html',
                    controller: 'companyController'
                })
                .when('/br',
                {
                    templateUrl: '/templates/Branch.html',
                    controller: 'companyController'
                })
                .when('/cl',
                {
                    templateUrl: '/templates/test.html',
                    controller: 'testController'
                })
                .when('/us',
                {
                    templateUrl: '/templates/User.html',
                    controller: 'userController'
                })
                .when('/sl',
                {
                    //For Main Party Master
                    templateUrl: '/templates/Party.html',
                    controller: 'partyController'
                })
                .when('/bp',
                {
                    //For Branch Party master
                    templateUrl: '/templates/BranchParty.html',
                    controller: 'branchPartyController'
                })
                .when('/i',
                {
                    //For Item master
                    templateUrl: '/templates/Item.html',
                    controller: 'itemController'
                })
                     .when('/rk',
                {
                    templateUrl: '/templates/Rack.html',
                    controller: 'RackController'
                })
                .when('/p',
                {
                    templateUrl: '/templates/Purchase.html',
                    controller: 'purchaseController'
                })
                .when('/s',
                {
                    templateUrl: '/templates/Sale.html',
                    controller: 'partsSaleController'
                })
                .when('/stt',
                {
                    templateUrl: '/templates/Transfer.html',
                    controller: 'transferController'
                })
                .when('/ss',
                {
                    templateUrl: '/templates/SaleSummary.html',
                    controller: 'PrintReportController'
                })
                    .when('/ssp',
                {
                    templateUrl: '/templates/SaleSummaryOnlyParts.html',
                    controller: 'PrintReportController'
                })
                .when('/sd',
                {
                    templateUrl: '/templates/SaleDetail.html',
                    controller: 'PrintReportController'
                })
                .when('/ps',
                {
                    templateUrl: '/templates/PurchaseSummary.html',
                    controller: 'PrintReportController'
                })
                .when('/pd',
                {
                    templateUrl: '/templates/PurchaseDetail.html',
                    controller: 'PrintReportController'
                })
                .when('/st',
                {
                    templateUrl: '/templates/StockTrial.html',
                    controller: 'PrintReportController'
                })
                .when('/stl',
                {
                    templateUrl: '/templates/StockLedger.html',
                    controller: 'PrintReportController'
                })
                .when('/rv',
                {
                    templateUrl: '/templates/receiptVoucher.html',
                    controller: 'RPVoucherController'
                })
                .when('/pv',
                {
                    templateUrl: '/templates/paymentVoucher.html',
                    controller: 'paymentVoucherController'
                })
                .when('/sbl',
                {
                    templateUrl: '/templates/SubledgerReport.html',
                    controller: 'PrintReportController'
                })
                .when('/srt',
                {
                    templateUrl: '/templates/SaleReturn.html',
                    controller: 'SaleReturnController'
                })
                     .when('/po',
                {
                    templateUrl: '/templates/PurchaseOrder.html',
                    controller: ''
                })
                .when('/prt',
                {
                    templateUrl: '/templates/PurchaseReturn.html',
                    controller: 'PurchaseReturController'
                })
                .when('/gstr',
                {
                    templateUrl: '/templates/GSTRReport.html',
                    controller: 'gstrReportController'
                })
                .when('/ms',
                {
                    templateUrl: '/templates/MonthlyGSTReport.html',
                    controller: 'ReportController'
                })
                .when('/cs',
                {
                    templateUrl: '/templates/CombinedStock.html',
                    controller: 'ReportController'
                })
                .otherwise({
                    redirectTo: '/home'
                })

                $locationProvider.html5Mode(true).hashPrefix('!');
            }])



// global verriable fro service basepath
myApp.constant('serviceBasePath', 'http://localhost:51980');
myApp.controller('authenticateController', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.data = '';
    dataService.GetAuthenticateData().then(function (data) { $scope.data = data; });
}]);

myApp.controller('authorizeController', ['$scope', 'dataService', function ($scope, dataService) {
    $scope.data = '';
    dataService.GetAuthorizeData().then(function (data) { $scope.data = data; })
}]);

myApp.controller('unauthorizeController', function ($scope) {
    $scope.data = 'You are unauthorize to access this page';
});



myApp.factory('dataService', ['$http', 'serviceBasePath', function ($http, serviceBasePath) {
    var fac = {};

    fac.GetAuthenticateData = function () {
        return $http.get(serviceBasePath + '/api/data/authenticate').then(function (resp) { return resp.data; }, function (resp) { });
    }

    fac.GetAuthorizeData = function () {
        return $http.get(serviceBasePath + '/api/data/authorize').then(function (resp) { return resp.data; }, function (resp) { });
    }

    fac.GetSiteMenues = function () {
        return $http.get(serviceBasePath + '/api/home/menus').then(function (resp) { return resp.data; }, function (resp) { })
    }

    return fac;

}]);

myApp.factory('userService', function () {
    var fac = {};

    fac.CurrentUser = null;
    fac.SetCurrentUser = function (user) {
        fac.CurrentUser = user;
        sessionStorage.user = angular.toJson(user);
    }

    fac.GetCurrentUser = function () {
        fac.CurrentUser = angular.fromJson(sessionStorage.user);
        return fac.CurrentUser;
    }

    return fac;

});



//http interceptor
myApp.config(['$httpProvider', function ($httpProvider) {
    var interceptor = function (userService, $q, $location) {
        return {
            request: function (config) {
                var currentUser = userService.GetCurrentUser();
                if (currentUser) {
                    config.headers["Authorization"] = "Bearer " + currentUser.access_token;
                }
                return config;
            },
            //requestError: function (rejection) {    
            //    //console.log(rejection);    
            //    // Contains the data about the error on the request and return the promise rejection.    
            //    return $q.reject(rejection);    
            //},            
            responseError: function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/unauthorized');
                    return $q.reject(response);
                }
                return $q.reject(response);
            }
        }
    }

    var params = ['userService', '$q', '$location'];
    interceptor.$inject = params;
    $httpProvider.interceptors.push(interceptor);

}]);





myApp.directive('sbPrecision', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {
            var precision = attributes.sbPrecision;

            function setPrecision() {
                var value = ngModel.$modelValue;

                //since this is just a mask, don't hide decimal values that
                //go beyond our precision and don't format empty values
                if (value && !isNaN(value) && countDecimalPlaces(value) <= precision) {
                    var formatted = Number(value).toFixed(precision);
                    ngModel.$viewValue = formatted;
                    ngModel.$render();
                }
            }

            element.bind('blur', setPrecision);
            setTimeout(setPrecision, 0); //after initial page render
        }

    };
})

myApp.directive('sbMin', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {

            function minimum(value) {
                if (!isNaN(value)) {
                    var validity = Number(value) >= attributes.sbMin;
                    ngModel.$setValidity('min-value', validity)
                }
                return value;
            }

            ngModel.$parsers.push(minimum);
            ngModel.$formatters.push(minimum);
        }

    };
})

myApp.directive('sbMax', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {


            function maximum(value) {
                if (!isNaN(value)) {
                    var validity = Number(value) <= attributes.sbMax;
                    ngModel.$setValidity('max-value', validity);
                }

                return value;
            }

            ngModel.$parsers.push(maximum);
            ngModel.$formatters.push(maximum);
        }

    };
})

myApp.directive('sbNumber', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {


            function validateNumber(value) {
                var validity = !isNaN(value);
                ngModel.$setValidity('number', validity)
                return value;
            }

            ngModel.$parsers.push(validateNumber);
            ngModel.$formatters.push(validateNumber);
        }

    };
})

myApp.directive('sbMaxPrecision', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attributes, ngModel) {

            function maxPrecision(value) {
                if (!isNaN(value)) {
                    var validity = countDecimalPlaces(value) <= attributes.sbMaxPrecision;
                    ngModel.$setValidity('max-precision', validity);
                }

                return value;
            }

            ngModel.$parsers.push(maxPrecision);
            ngModel.$formatters.push(maxPrecision);
        }

    };
})

function countDecimalPlaces(value) {
    var decimalPos = String(value).indexOf('.');
    if (decimalPos === -1) {
        return 0;
    } else {
        return String(value).length - decimalPos - 1;
    }
}