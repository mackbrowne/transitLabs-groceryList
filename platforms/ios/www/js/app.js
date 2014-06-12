angular.module('groceryList', ['ionic'])

.controller('MyCtrl', function($scope, $ionicPopup) {
  
  $scope.data = {
    textBox: ""
  };
  
  $scope.onItemDelete = function() {
    for(var i=$scope.items.length; i>0; i--){
       var value = $scope.items[i-1];
       if(value.checked){ 
         $scope.items.splice($scope.items.indexOf(value), 1);
       }
    }
  };
  
  $scope.items = [
    { id: "Bread", checked: false },
    { id: "Milk", checked: false }
  ];  
  
  $scope.add = function(){
      $ionicPopup.show({
     template: '<input type="text" ng-model="data.textBox">',
     title: 'Add Item',
     subTitle: 'Write the grocery item in the box below',
     scope: $scope,
     buttons: [
       { text: 'Cancel' },
       {
         text: '<b>Save</b>',
         type: 'button-positive',
         onTap: function(e) {
           if (!$scope.data.textBox) {
             //don't allow the user to close unless he enters wifi password
             e.preventDefault();
           } else {
             $scope.items.push({id:$scope.data.textBox, checked:false});
             $scope.textBox = "";
             return;
           }
         }
       },
     ]
   });
  }

}) 
    // TickList
    .directive('tickList', function () {
        return {
            restrict: 'E',
            transclude: true,
            template: '<ul class="list" ng-transclude></ul>',
            scope: {
                multiple: '@',
                selectedIcon: '@',
                $onChange: '&onChange'
            },
            controller: ['$scope', function ($scope) {
                var items = $scope.items = [];
                this.scope = $scope;

                this.addItem = function (item) {
                    items.push(item);
                };
                this.selectItem = function (item) {
                    $scope.$apply(function () {
                        if ($scope.multiple) {
                            item.$select(!item.model.selected);
                        } else {
                            var i, l = items.length;
                            for (i = 0; i < l; ++i) {
                                items[i].$select(false);
                            }
                            item.$select(true);
                        }
                    });
                }
            }]
        }
    })
    .directive('tickListItem', ['$ionicGesture', function ($ionicGesture) {
        return {
            restrict: 'E',
            require: '^tickList',
            transclude: true,
            scope: {
                selected: '@',
                $onChange: '&onChange',
                selectedIcon: '@',
                model: '='
            },
            template: '<li class="item item-icon-right" ><div ng-transclude></div><i ng-show="selected" class="icon"></i></li>',

            link: function (scope, element, attrs, tickListCtrl) {
                function tap() {
                    tickListCtrl.selectItem(scope);
                }

                scope.$select = function (value) {
                    var val = scope.model.selected;
                    scope.selected = value;
                    if (scope.model) scope.model.selected = value;
                    if (val != value) scope.$onChange(scope.model);
                };
                if (!scope.model) {
                    scope.model = {selected: scope.selected == 'true'};
                }
                //set selected icon: defined in: tickListItem -> tickList -> default
                element.find('i').addClass(scope.selectedIcon || tickListCtrl.scope.selectedIcon || 'ion-checkmark');
                tickListCtrl.addItem(scope);
                $ionicGesture.on('tap', tap, element);
            }
        }
    }]);