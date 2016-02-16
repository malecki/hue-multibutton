'use strict'

module.exports = Hue

function Hue($log, _, machina, Huejay, $localStorage){
    var Hue = machina.Fsm.extend({
        namespace: 'hue-client',
        initialState: 'uninitialized',
        initialize: function(){
            this.username = $localStorage.username || ""
            this.host = $localStorage.host || ""
        },
        states: {
            uninitialized: {
                initialize: function(cfg){
                    var Hue = new Huejay.Client({
                        username: this.username,
                        host: this.host
                    })
                    Hue.bridge.isAuthenticated().then(auth => {
                        if(auth){
                            this.client = Hue
                            this.transition('initialized')
                            $localStorage.username = this.username
                            $localStorage.host = this.host
                        }
                    })
                }
            },
            initialized: {
                _onEnter: function(){
                    $log.debug('authenticated hue userid', this.username)
                }
            }
        }
    })
    return Hue
}

Hue.$inject = ['$log', 'lodash', 'machina', 'Huejay', '$localStorage']
