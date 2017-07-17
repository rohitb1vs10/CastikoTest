var MainModule = angular.module("MainModule");


/////////////////////  Main Service for data sharing  //////////////////////
MainModule.service("currentUserService", function(){
	var currentUser = {
	}

	var updateUserDetails = function(user){
		currentUser = user;
	}

	var getUserDetails = function(){
		return currentUser;
	}

	return{
		updateUserDetails : updateUserDetails,
		getUserDetails : getUserDetails
	}
});
