var MainModule = angular.module('MainModule', ['ngDragDrop']);

MainModule.controller('MainCtrl', function($scope, currentUserService, currentCardService) {
  //////////////////////////// Update Current Users Sercice ////////////////////////////
  $scope.currentUser = localStorage.getItem("full_user");
  //localStorage.clear();
  $scope.currentUser = JSON.parse($scope.currentUser);
  delete $scope.currentUser.password;
  currentUserService.updateUserDetails($scope.currentUser)
  

  currentCardService.queryCardData();

  $scope.deck = {};
  $scope.cards = [];

  $scope.reset = false;

  $scope.resetGame = function(){
    $scope.reset = false;
    var cardData = currentCardService.resetCardData();
    $scope.deck = cardData.deck;
    $scope.cards = cardData.cards_left;
  }


  // Get users previous data
  currentCardService.checkCardData($scope, function(){
    var cardData = currentCardService.getCardData();
    $scope.deck = cardData.deck;
    $scope.cards = cardData.cards_left; 
  })



  ////////////////////////  Deck data and control  //////////////////////////
  $scope.onDrop = function($event, $data, array){
    //console.log("on drop ", array, " ", $data);
    //array.push($data);
    $scope.deck[array].push($data);
  };
  
  $scope.dropValidate = function(target, source) {
    //console.log("drop validate with target ", target, " source ", source, " and val ", source.suit == target);
    return source.suit == target;
  };
  
  $scope.dropSuccessHandler = function($event,index,array){
    array.splice(index, 1);
    if(array.length == 0){
      $scope.reset = true;
    }
    //array.splice(index,1);
    //console.log("drop success" ,index, " ", array);
  };



  ////////////////////////  Update data b4 leaving  //////////////////////////
  window.onbeforeunload = function () {
    currentCardService.updateCardData($scope.cards, $scope.deck);
  };

  $scope.logout= function(){
    currentCardService.updateCardData($scope.cards, $scope.deck);
    localStorage.clear();
    window.location.href='/index.html';
  }
  
});