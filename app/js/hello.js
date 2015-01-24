riot.tag('hello', '<h3>{ opts.hello }</h3> <form onsubmit="{ sayHello }" class="{hide: clicked}"> <button>Say Hello</button> </form>', function(opts) {
  this.sayHello = function() {
    opts.hello = 'Hello'
    this.clicked = true
  }.bind(this)

})