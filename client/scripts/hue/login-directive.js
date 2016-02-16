'use strict'

module.exports = LoginDirective

function LoginDirective(Hue) {
    return {
        restrict: 'E',
        template: require('./login-form.html'),
        link: function(scope) {
            let hue = new Hue()
            scope.hue = hue
            hue.on('transition', function(){
                scope.$digest()
            })
        }
    }
}

LoginDirective.$inject = ['Hue']
