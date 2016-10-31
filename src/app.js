import React from 'react'
import { render } from 'react-dom'
import elasticsearch from 'elasticsearch'

let client = new elasticsearch.Client({
	host: 'localhost:9200',
	log: 'trace'
})

const App = React.createClass({
	getInitialState () {
		return {
			results: []
		}
	},
	handleChange ( event ) {
		const search_query = event.target.value

		client.search({
			q: search_query
		}).then(function ( body ) {
			this.setState({ results: body.hits.hits })
		}.bind(this), function ( error ) {
			console.trace( error.message );
		});
	},
	handleCreateIndex ( event ) {
		client.indices.create({
			index: "fposts"
		}).then(function (body) {
			window.alert("index created");
			client.index({
				index: 'fposts',
				type: 'post',
				body: {
					title: 'Test1',
					content: 'Once upon a time..',
					tags: ['y', 'z']
				}
			}).then(function (body) {
				window.alert("doc inserted");
			}.bind(this), function (error) {
				console.trace (error.message);
			});
		}.bind(this), function ( error ) {
			console.trace( error.message );
		});
	},
	render () {
		return (
			<div className="container">
				<input type="text" onChange={ this.handleChange } />
				<input type="button" value="create index" onClick={ this.handleCreateIndex } />
				<SearchResults results={ this.state.results } />
			</div>
		)
	}
})

const SearchResults = React.createClass({
	propTypes: {
		results: React.PropTypes.array
	},
	getDefaultProps () {
		return { results: [] }
	},
	render () {
		return (
			<div className="search_results">
				<hr />
				<ul>
				{ this.props.results.map((result) => {
					return <li key={ result._id }>{ result._source.title }</li> }) }
				</ul>
			</div>
		)
	}
})


render( <App />, document.getElementById( 'main' ) )
