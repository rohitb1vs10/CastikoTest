var LoginModule = angular.module("LoginModule");


// Login Controller for authentication //
LoginModule.controller('LoginCtrl', function($scope, $http){
	$scope.user_name = "";
	$scope.password = "";
  $scope.data = new Array();


  $scope.authenticateUser = function(){

    // Authetication //
    $http({
      method: 'GET',
      url: 'http://localhost:3000/auth',
      params: {user_name: $scope.user_name, password: $scope.password}
    }).then(function successCallback(response) {
      console.log(response);
      $scope.data = response.data;
      if(response.data.length != 0){
        localStorage.clear();
        localStorage.setItem("full_user", JSON.stringify(response.data[0]));

        // redirect to main page //
        window.location.href='/views/main.html';
      }
      else{
        $scope.error_mssg = "Wrong username or password";
      }
    }, function errorCallback(response) {
      console.log(response);
    });
  };
});


// New User Registration //
LoginModule.controller('RegisterCtrl', function($scope, $http){
  $scope.registerError = "";
  $scope.newUser = {
    user_name : "",
    password : ""
  }

  $scope.addNewUser = function(){
    $http({
      method: 'POST',
      url: 'http://localhost:3000/users',
      data: $scope.newUser
    }).then(function successCallback(response) {
      console.log(response);
      if(response.data.ok == 1){
        localStorage.setItem("full_user", JSON.stringify($scope.newUser));
        // redirect to main page //
        window.location.href='/views/main.html';
      }
      else{
        $scope.registerError = "Some error occured";
      }
    }, function errorCallback(response) {
      console.log(response);
    });
  }
});