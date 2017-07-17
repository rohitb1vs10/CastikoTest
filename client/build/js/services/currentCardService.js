var MainModule = angular.module("MainModule");


/////////////////////  Main Service for data sharing  //////////////////////
MainModule.service("currentCardService", function($http, currentUserService, $rootScope){
    var cardData = {
    	cards_left:[],
    	deck:{}
    };

	var queryForData = function(){
		var currentUser = currentUserService.getUserDetails();
		console.log("querying for data for ", currentUser);
		$http({
	      method: 'GET',
	      url: 'http://localhost:3000/card_data',
	      params: {
	      	user_name:currentUser.user_name
	      }
	    }).then(function successCallback(response) {
	      cardData = response.data[0].cards;
	      $rootScope.$emit('received-card-data');
	    }, function errorCallback(response) {
	      console.log(response);
	    });
	}

	var updateData = function(){
		var currentUser = currentUserService.getUserDetails();
		$http({
	      method: 'POST',
	      url: 'http://localhost:3000/card_data',
	      data: {
	      		user_name:currentUser.user_name,
		      	cards:cardData
	      }
	    }).then(function successCallback(response) {
	      console.log('card_data is:', response);
	      //taskData = response.data;
	    }, function errorCallback(response) {
	      console.log(response);
	    });
	}

	var resetData = function(){
		function shuffle(array) {
			var currentIndex = array.length, temporaryValue, randomIndex;
			// While there remain elements to shuffle...
			while (0 !== currentIndex) {
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);
				currentIndex -= 1;
				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;
			}
			return array;
		}

		var all_cards = [];
		var suits = ['hearts', 'clubs', 'diamonds', 'spades']
		var count = 0;
		for(var suit in suits){
		    all_cards.push({suit:suits[suit], value:"jack"});
		    all_cards.push({suit:suits[suit], value:"queen"});
		    all_cards.push({suit:suits[suit], value:"king"});
		    all_cards.push({suit:suits[suit], value:"ace"});
		    for(var i=2; i<=10; i++){
		        all_cards[count+i+2] = {suit:suits[suit], value:i.toString()};
		    }
		  count += 13;
		}

		cardData.deck = {
            hearts : [{
              suit:'hearts',
              value:"enter all cards "
            }],
            clubs : [{
              suit:"clubs",
              value:"enter all cards "
            }],
            diamonds : [{
              uit:"diamonds",
              value:"enter all cards "
            }],
            spades : [{
              suit:"spades",
              value:"enter all cards "
            }],
        }
        cardData.cards_left = shuffle(all_cards);
	}




	////////////////////////// Service Methods ///////////////////////////
	var queryCardData = function(){
		queryForData();
	}

	var checkCardData = function(scope, callback){
		var handler = $rootScope.$on('received-card-data', callback);
		scope.$on('$destroy', handler);
	}

	var updateCardData = function(cards_left, deck){
		cardData.cards_left = cards_left;
		cardData.deck = deck;
		updateData();
	}

	var getCardData = function(){
		return cardData;
	}

	var resetCardData = function(){
		resetData();
		return cardData;
	}

	return{
		queryCardData : queryCardData,
		checkCardData : checkCardData,
		updateCardData : updateCardData,
		getCardData : getCardData,
		resetCardData : resetCardData
	}
});



