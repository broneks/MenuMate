<hello>

  <h3>{ opts.hello }</h3>

  <form onsubmit={ sayHello } class={hide: clicked}>
    <button>Say Hello</button>
  </form>

  sayHello() {
    opts.hello = 'Hello'
    this.clicked = true
  }

</hello>