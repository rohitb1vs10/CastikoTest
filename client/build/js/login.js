(function(){

////////////////////  Login Module and Controller  //////////////////////
var LoginModule = angular.module("LoginModule", ['ngRoute']);


// Ng-View Routing //
LoginModule.config(function($routeProvider) {
// Login Routing //
  $routeProvider
      .when("/", {
          templateUrl : "/views/login/login_form.html",
          controller: "LoginCtrl"
      })
      .when("/signin", {
          templateUrl : "/views/login/login_form.html",
          controller: "LoginCtrl"
      })
      .when("/signup", {
          templateUrl : "/views/login/register_form.html",
          controller: "RegisterCtrl"
      })
});




})();