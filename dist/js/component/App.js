var React = require("react")
var ReactDom = require("react-dom")
var Menu_dishes = require("./menu_dishes")

class App extends React.Component{
	render(){
		return(
			<Menu_dishes name="menu"/>
		)
	}
}

ReactDom.render(<App name="Vova"/>, document.getElementById("app"))
