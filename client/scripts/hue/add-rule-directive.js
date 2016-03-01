'use strict'

module.exports = AddRuleDirective

function AddRuleDirective(BUTTON_EVENTS) {
    return {
        restrict: 'E',
        scope: false,
        template: require('./add-rule.html'),
        link: function(scope){
            scope.buttonEvents = BUTTON_EVENTS
            scope.buttonEvent = scope.buttonEvents[0]
            scope.filterButtonRules = function(id){
                scope.filteredRules = scope.hue.filterButtonRules(id)
            }
            scope.filterButtonRules(scope.buttonEvent.id)
        }
    }
}

AddRuleDirective.$inject = ['BUTTON_EVENTS']
