var React = require("react")

class MenuDishes extends React.Component{
	render(){
		return(
			<div>{this.props.name}</div>
		)
	}
}

module.exports = MenuDishes;